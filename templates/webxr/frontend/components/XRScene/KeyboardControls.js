import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber';

const KeyboardControls = (props) => {
    const keys = {
      KeyW: 'forward',
      KeyS: 'backward',
      KeyA: 'left',
      KeyD: 'right',
      ArrowUp: 'rotateUp',
      ArrowRight: 'rotateRight',
      ArrowDown: 'rotateDown',
      ArrowLeft: 'rotateLeft',
      Space: 'jump',
    }
  
    const moveFieldByKey = (key) => keys[key]
  
    const [movement, setMovement] = useState({
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    })

    const moveSpeed = .2;
    const rotateSpeed = .03;
    const { camera } = useThree();
    const { children } = props;
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
      }
      const handleKeyUp = (e) => {
        setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
      }
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useFrame(() => {
        const { forward, backward, left, right, rotateLeft, rotateRight, rotateDown, rotateUp } = movement;
        if(forward) {
          camera.position.x -= Math.sin(camera.rotation.y) * moveSpeed;
          camera.position.z -= -Math.cos(camera.rotation.y) * moveSpeed;
        }
        if(backward) {
          camera.position.x += Math.sin(camera.rotation.y) * moveSpeed;
          camera.position.z += -Math.cos(camera.rotation.y) * moveSpeed;
        } 
        
        if(left) {
          camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * moveSpeed;
          camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * moveSpeed;
        } 
        
        if(right) {
          camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * moveSpeed;
          camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * moveSpeed;
        }
    
        if(rotateLeft) {
          camera.rotation.y -= rotateSpeed
        } 
        
        if(rotateRight) {
          camera.rotation.y += rotateSpeed;
        }
        if(rotateDown) {
          if(camera.position.y > -.3) camera.position.y -= rotateSpeed;
        }
        if(rotateUp) {
          if(camera.position.y < 1) camera.position.y += rotateSpeed;
        }
      });
    
    
    return(
        <>
            {children}
        </>
    )
}

export default KeyboardControls;