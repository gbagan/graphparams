module GraphParams.Data where

codeExample :: String
codeExample = """
graph(9)
.addClique(0, 1, 2)
.addPath(2, 3, 4)
.addCycle(4, 5, 6, 7)
.addEdges(1-5, 4-8)
.addEdge(3, 8)`;
""""

helpText :: String
helpText = """
petersen     // petersen graph
graph(n)       // create an empty graph with n vertices
path(n)        // create a path graph with n vertices
cycle(n)       // create a cycle graph with n vertices
clique(n)      // create a complete graph with n vertices
star(n)        // create a star graph with n leaves
biclique(n, m) // create a bipartite complete graph
grid(n, m)     // create a grid of size n x m
sun(n)         // sun graph with 2n vertices
// methods
.addEdge(0, 2)
.addEdges(1-2, 2-3)
.removeEdge(1, 2)
.addPath(2, 3, 5)
.addCycle(2, 3, 5)
 .addClique(2, 3, 5)
 .complement()
 .lineGraph()
 .union(g2)
 .join(g2)
 .product(g2)  // cartesian product
 .product(graph(4).addCycle(0, 1, 2).addEdge(2, 3))

digraph(5)     // create an empty digraph with 5 vertices
digraph('name')  // name P5 | C5
.addPath(0, 2, 3)
.addCycle(1, 2, 3)
.addEdges([0-2], [2-3])
"""