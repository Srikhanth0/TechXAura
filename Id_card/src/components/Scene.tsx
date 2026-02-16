

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment } from '@react-three/drei';
import { Leva } from 'leva';

// This would be your migrated Card component
// import Card from './Card'; 

interface SceneProps {
    children?: React.ReactNode;
}

export default function Scene({ children }: SceneProps) {
    return (
        <div className="h-screen w-full relative bg-gray-100">
            {/* Leva Controls - separate them so they render on client */}
            <Leva collapsed={false} />

            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 30 }}
                style={{ height: '100vh', width: '100vw' }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Environment preset="city" />

                <Physics debug={false} gravity={[0, -9.81, 0]}>
                    {/* Your actual 3D content goes here */}
                    {children}
                </Physics>
            </Canvas>
        </div>
    );
}