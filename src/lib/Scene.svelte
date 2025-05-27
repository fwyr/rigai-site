<script>
    import { T, useTask } from '@threlte/core'
    import { interactivity, GLTF } from '@threlte/extras'
    import { Spring } from 'svelte/motion'
    

    interactivity()
    const scale = new Spring(1)

    let rotation = 0
    
    // useTask is used to create a task that runs code 
    // on every frame via Threlte's unified frame loop
    useTask((delta) => {
        rotation += delta
    })

    const secretsauceScale = new Spring(30)
</script>

<!--
coordinates are X (left-right), Y (up-down), Z (front-back)
-->

<T.PerspectiveCamera 
    makeDefault 
    position={[7, 7, 7]}
    oncreate={(ref) => {
        ref.lookAt(0, 1, 0)
    }}
/>

<T.DirectionalLight 
    position={[0, 10, 10]} 
    castShadow
/>

<T.AmbientLight
    intensity={1}
/>

<!--
possible to set rotation/position = {[x, y, z]}
-->

<!-- cuboid mesh -->
<T.Mesh 
    rotation.y={rotation}
    position.y={1}
    scale={scale.current}
    onpointerenter={() => {
        scale.target = 1.5
    }}
    onpointerleave={() => {
        scale.target = 1
    }}
    castShadow
>
    <T.BoxGeometry args={[1,2,1]}/>
    <T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<!-- circular floor mesh -->
<T.Mesh
    rotation.x={-Math.PI / 2}
    receiveShadow
>
    <T.CircleGeometry args={[4, 40]} />
    <T.MeshStandardMaterial color="white" />
</T.Mesh>


<!-- secret sauce -->

<!-- <T.Mesh
    rotation.y={rotation*1000}
    position={[0, 0, 0]}
    scale={secretsauceScale.current}
    onpointerenter={() => secretsauceScale.target = 50}
    onpointerleave={() => secretsauceScale.target = 30}
    castShadow
    
>

    <GLTF
        url="/secretsauce.glb"
        scale={1}
        on:error={(e) => console.error(e)}
    />
</T.Mesh> -->