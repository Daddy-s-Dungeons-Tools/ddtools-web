import { Canvas } from "@react-three/fiber";
import {
  BoxProps,
  Physics,
  PlaneProps,
  useBox,
  usePlane,
} from "@react-three/cannon";
import { Vector3 } from "three";

function Plane(props: PlaneProps) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    // @ts-ignore
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
}

function Cube(props: BoxProps) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }));
  return (
    // @ts-ignore
    <mesh ref={ref} scale={new Vector3(2, 2, 2)}>
      <boxGeometry />
    </mesh>
  );
}

export function DiceRoller() {
  return (
    <Canvas frameloop="demand">
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <Physics>
        <Plane />
        <Cube />
      </Physics>
    </Canvas>
  );
}
