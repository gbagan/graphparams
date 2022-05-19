module GraphParams.Data where

codeExample ∷ String
codeExample = """graph(9)
.addClique(0, 1, 2)
.addPath(2, 3, 4)
.addCycle(4, 5, 6, 7)
.addEdge(3, 8)
"""

helpText ∷ String
helpText = """petersen     // petersen graph
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
.removeEdge(1, 2)
.addPath(2, 3, 5)
.addCycle(2, 3, 5)
.addClique(2, 3, 5)
.complement
// operators
g1 | g2 // disjoint union
g1 >< g2 // join
g1 * g2  // cartesian product
"""