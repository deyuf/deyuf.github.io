# UR5 visual geometry

Derived from the ROS-Industrial universal_robot UR5 CAD visual meshes:
https://github.com/ros-industrial/universal_robot/tree/noetic-devel/ur_description/meshes/ur5/visual

The original BSD license is included in LICENSE. The derived GLB preserves the
original geometry, vertex normals and units. Materials were changed for this
portfolio. The page is not affiliated with or endorsed by Universal Robots.

To regenerate, download the seven .dae files from the source above and run:
python scripts/convert-ur5.py /path/to/dae/directory
