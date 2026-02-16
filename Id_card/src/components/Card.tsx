

import { extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useControls } from 'leva';
import { RigidBody } from '@react-three/rapier';

// extend needs to happen once at the module level
extend({ MeshLineGeometry, MeshLineMaterial });

export default function Card() {
    const lineRef = useRef<any>(null);

    // Leva controls work normally here because of 'use client'
    const { color } = useControls({ color: '#ff0000' });

    useFrame((_, delta) => {
        // Your animation loop logic
        if (lineRef.current) {
            lineRef.current.rotation.y += delta;
        }
    });

    return (
        <RigidBody>
            <mesh ref={lineRef}>
                {/* The types we defined in step 4 allow this to work without TS errors */}
                <meshLineGeometry />
                <meshLineMaterial color={color} lineWidth={0.1} />
            </mesh>
        </RigidBody>
    );
}