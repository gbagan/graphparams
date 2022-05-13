module GraphParams.Generate where
{-
path :: Int -> Graph
path n = graph n # addPath (0..(n-1))

cycle :: Int -> Graph
cycle n = graph n # addCycle (0..(n-1))

clique :: Int -> Graph
clique n = graph n # addClique (0..(n-1))

biclique :: Int -> Int -> Graph
biclique n m = graph n `join` graph m

grid :: Int -> Int -> Graph
grid n m = path n `product` graph m

star :: Int -> Graph
star = biclique 1

{-
petersen =  fromEdges 10 $ 0..4 >>= \i -> []
    0..4 # foldl \g i -> g # addEdges i ((i+1) `mod` 5)
                           
    graph 10
    graph(10) |> updateGraph(addEdge => {
        for (let i = 0; i < 5; i++) {
            addEdge(i, (i + 1) % 5);
            addEdge(i + 5, (i + 2) % 5 + 5);
            addEdge(i, i + 5);
        }
    });

sun :: Int -> Graph
sun n =
    graph (2 * n)
        # addClique (0..(n-1))
        # addCycle (0..(n-1) >>= \i -> [i, i+n])
-}