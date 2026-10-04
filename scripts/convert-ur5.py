"""Convert the BSD-licensed ROS-Industrial UR5 visual meshes to an indexed GLB.

Usage: python scripts/convert-ur5.py /path/to/dae/directory
Source: ros-industrial/universal_robot, noetic-devel, ur_description/meshes/ur5/visual.
Preserves CAD vertex normals and node transforms; excludes authoring cameras/lights.
"""
import array
import json
import math
from pathlib import Path
import struct
import sys
import xml.etree.ElementTree as ET

NS = {'c': 'http://www.collada.org/2005/11/COLLADASchema'}
root = Path(sys.argv[1])
output = Path(__file__).resolve().parents[1] / 'public/models/ur5/ur5.glb'
data = bytearray()
doc = {'asset': {'version': '2.0', 'generator': 'UR5 CAD converter'}, 'scene': 0,
       'scenes': [{'nodes': []}], 'nodes': [], 'meshes': [], 'accessors': [], 'bufferViews': [],
       'materials': [
           {'name': 'satinAluminum', 'pbrMetallicRoughness': {'baseColorFactor': [.62, .65, .68, 1], 'metallicFactor': 1, 'roughnessFactor': .3}},
           {'name': 'anodizedGraphite', 'pbrMetallicRoughness': {'baseColorFactor': [.12, .15, .18, 1], 'metallicFactor': .9, 'roughnessFactor': .34}},
           {'name': 'machinedSteel', 'pbrMetallicRoughness': {'baseColorFactor': [.32, .35, .38, 1], 'metallicFactor': 1, 'roughnessFactor': .26}},
           {'name': 'blackHardware', 'pbrMetallicRoughness': {'baseColorFactor': [.035, .04, .045, 1], 'metallicFactor': .7, 'roughnessFactor': .48}},
       ]}

def accessor(values, kind, components, bounds=False):
    while len(data) % 4: data.append(0)
    offset = len(data)
    packed = array.array('f' if kind == 5126 else 'I', values)
    if sys.byteorder != 'little': packed.byteswap()
    data.extend(packed.tobytes())
    view = len(doc['bufferViews'])
    doc['bufferViews'].append({'buffer': 0, 'byteOffset': offset, 'byteLength': len(data)-offset})
    entry = {'bufferView': view, 'componentType': kind, 'count': len(values)//components,
             'type': {1: 'SCALAR', 2: 'VEC2', 3: 'VEC3'}[components]}
    if bounds:
        entry['min'] = [min(values[i::components]) for i in range(components)]
        entry['max'] = [max(values[i::components]) for i in range(components)]
    doc['accessors'].append(entry)
    return len(doc['accessors'])-1

for link in ['base', 'shoulder', 'upperarm', 'forearm', 'wrist1', 'wrist2', 'wrist3']:
    tree = ET.parse(root / (link+'.dae')).getroot()
    primitives = []
    geometries = {g.attrib['id']: g for g in tree.findall('.//c:library_geometries/c:geometry', NS)}
    for node in tree.findall('.//c:library_visual_scenes/c:visual_scene/c:node', NS):
        instance = node.find('c:instance_geometry', NS)
        if instance is None: continue
        mesh = geometries[instance.attrib['url'][1:]].find('c:mesh', NS)
        matrix_node = node.find('c:matrix', NS)
        matrix = list(map(float, matrix_node.text.split())) if matrix_node is not None else [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
        sources = {}
        for source in mesh.findall('c:source', NS):
            raw = source.find('c:float_array', NS)
            if raw is not None:
                stride = int(source.find('c:technique_common/c:accessor', NS).attrib['stride'])
                sources[source.attrib['id']] = (list(map(float, raw.text.split())), stride)
        vertices = {v.attrib['id']: v.find("c:input[@semantic='POSITION']", NS).attrib['source'][1:] for v in mesh.findall('c:vertices', NS)}
        for triangles in mesh.findall('c:triangles', NS):
            inputs = triangles.findall('c:input', NS)
            stride = max(int(i.attrib['offset']) for i in inputs)+1
            semantic = {i.attrib['semantic']: (i.attrib['source'][1:], int(i.attrib['offset'])) for i in inputs}
            position_src, pos_offset = semantic['VERTEX']
            position_src = vertices[position_src]
            normal_src, norm_offset = semantic['NORMAL']
            points, point_stride = sources[position_src]
            normals, normal_stride = sources[normal_src]
            ids = list(map(int, triangles.find('c:p', NS).text.split()))
            positions_out, normals_out, uvs_out, indices_out, unique = [], [], [], [], {}
            for index in range(0, len(ids), stride):
                key = (ids[index+pos_offset], ids[index+norm_offset])
                if key not in unique:
                    unique[key] = len(unique)
                    p = points[key[0]*point_stride:key[0]*point_stride+3]
                    n = normals[key[1]*normal_stride:key[1]*normal_stride+3]
                    positions_out.extend(sum(matrix[row*4+k]*p[k] for k in range(3))+matrix[row*4+3] for row in range(3))
                    normal = [sum(matrix[row*4+k]*n[k] for k in range(3)) for row in range(3)]
                    length = math.sqrt(sum(v*v for v in normal)) or 1
                    normals_out.extend(v/length for v in normal)
                    uvs_out.extend([(math.atan2(p[1], p[0])+math.pi)/(2*math.pi), p[2]*20])
                indices_out.append(unique[key])
            name = triangles.attrib.get('material', '').lower()
            material = 1 if 'blau' in name else 0 if 'rohr' in name else 2 if ('verbindung' in name or 'scheibe' in name) else 3
            primitives.append({'attributes': {'POSITION': accessor(positions_out, 5126, 3, True),
                                               'NORMAL': accessor(normals_out, 5126, 3),
                                               'TEXCOORD_0': accessor(uvs_out, 5126, 2)},
                               'indices': accessor(indices_out, 5125, 1), 'material': material})
    doc['meshes'].append({'name': link, 'primitives': primitives})
    doc['scenes'][0]['nodes'].append(len(doc['nodes']))
    doc['nodes'].append({'name': link, 'mesh': len(doc['meshes'])-1})
    print(link, sum(doc['accessors'][p['indices']]['count']//3 for p in primitives), 'triangles')

doc['buffers'] = [{'byteLength': len(data)}]
header = json.dumps(doc, separators=(',', ':')).encode()
header += b' ' * (-len(header) % 4)
data.extend(b'\0' * (-len(data) % 4))
output.write_bytes(struct.pack('<III', 0x46546c67, 2, 12+8+len(header)+8+len(data))+
                   struct.pack('<II', len(header), 0x4e4f534a)+header+
                   struct.pack('<II', len(data), 0x004e4942)+data)
print(output, output.stat().st_size, 'bytes')
