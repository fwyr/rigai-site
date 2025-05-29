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

    const secretsauceScale = new Spring(1)
</script>

<!--
coordinates are X (left-right), Y (up-down), Z (front-back)
-->

<T.PerspectiveCamera 
    makeDefault 
    position={[10, 10, 20]}
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
<!-- <T.Mesh 
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
</T.Mesh> -->

<!-- circular floor mesh -->
<T.Mesh
    position={[0,-2,0]}
    rotation.x={-Math.PI / 2}
    receiveShadow
>
    <T.CircleGeometry args={[10,40]} />
    <T.MeshStandardMaterial color="white" />
</T.Mesh>


<!-- secret sauce -->

<!-- onpointerenter={() => secretsauceScale.target = 1.5} -->
<!-- onpointerleave={() => secretsauceScale.target = 1.5} -->

<T.Mesh
    position={[0, 0, 0]}
    scale={secretsauceScale.current}

    castShadow
    
>

    <GLTF
        url="/pc1.glb"
        scale={0.5}
        rotation.y={rotation}
        on:error={(e) => console.error(e)}
    />
</T.Mesh>