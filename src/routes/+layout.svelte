<script>
  // import '/fonts.css?url';
</script>

<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact/">Contact</a></li>
    <li><a href="/about">About</a></li>
  </ul> 
</nav>

<slot />

<style>  

:global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }


/* html body {
  margin: 0;
  padding: 0;
  /* height: calc(100vh - 3rem); */
  /* overflow: hidden;
} */ 

nav {
  background-color: #091540;
  height: 3rem;
}

ul {
  list-style-type: none;
  margin: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: row;
  color: white;
}

li {
  padding-left: 2rem;
  padding-right: 2rem;


}

/* unvisited link */
 a:link {
  color: white;
}

/* visited link */
a:visited {
  color: grey;
}

/* mouse over link */
a:hover {
  color: yellow;
}

/* selected link */
a:active {
  color: yellow;
} 


</style>