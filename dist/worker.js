(() => {
  // src/worker/lib/fp.js
  var countBy = (list, fn) => {
    let count = 0;
    let n = list.length;
    for (let i = 0; i < n; i++) {
      if (fn(list[i], i))
        count++;
    }
    return count;
  };
  var maximum = (list) => Math.max(...list);
  var maxBy = (list, fn) => {
    let max = void 0;
    let bestScore = -Infinity;
    let n = list.length;
    for (let i = 0; i < n; i++) {
      const x = list[i];
      const score = fn(x);
      if (score > bestScore) {
        bestScore = score;
        max = x;
      }
    }
    return max;
  };
  var minimum = (list) => Math.min(...list);
  var minBy = (list, fn) => {
    if (list === void 0)
      return (l2) => minBy(fn, l2);
    let min = void 0;
    let bestScore = Infinity;
    let n = list.length;
    for (let i = 0; i < n; i++) {
      const x = list[i];
      const score = fn(x);
      if (score < bestScore) {
        bestScore = score;
        min = x;
      }
    }
    return min;
  };
  var sum = (l) => {
    const n = l.length;
    let x = 0;
    for (let i = 0; i < n; i++) {
      x += l[i];
    }
    return x;
  };
  var range = (n, m) => {
    const t = Array(m - n);
    for (let i = n; i < m; i++)
      t[i - n] = i;
    return t;
  };
  var times = (fn, n) => {
    const list = Array(n);
    for (let i = 0; i < n; i++) {
      list[i] = fn(i);
    }
    return list;
  };

  // src/worker/lib/binary.js
  var encode = (set) => {
    let x = 0;
    for (const i of set) {
      x |= 1 << i;
    }
    return x;
  };
  var decode = (x) => {
    const s = [];
    let y = x;
    let i = 0;
    while (y > 0) {
      if ((y & 1) === 1) {
        s.push(i);
      }
      i++;
      y >>= 1;
    }
    return s;
  };
  function* subsets(n, k) {
    if (k === 0) {
      yield 0;
    } else if (n === k) {
      yield (1 << n) - 1;
    } else {
      yield* subsets(n - 1, k);
      for (const set of subsets(n - 1, k - 1)) {
        yield set | 1 << n - 1;
      }
    }
  }

  // src/worker/lib/sorted.js
  var insert = (list, x) => {
    const index = list.findIndex((y) => y >= x);
    if (index === -1)
      return list.concat(x);
    else if (list[index] === x)
      return list;
    else
      return list.slice(0, index).concat(x, ...list.slice(index));
  };
  var allDifferent = (list) => {
    let pred = null;
    const n = list.length;
    for (let i = 0; i < n; i++) {
      const x = list[i];
      if (x === pred)
        return false;
      pred = x;
    }
    return true;
  };

  // src/worker/lib/graph/graph.js
  var graph = (nbVertices2) => times(() => [], nbVertices2);
  var edges = (graph2) => {
    const es = [];
    for (let i = 0; i < graph2.length; i++) {
      for (const j of graph2[i]) {
        if (i < j) {
          es.push([i, j]);
        }
      }
    }
    return es;
  };
  var hasEdge = (graph2, v, w) => graph2[v].includes(w);
  var edgeId = (graph2, x, y) => x < y ? x * graph2.length + y : y * graph2.length + x;
  var addEdge = (graph2, v, w) => {
    graph2[v] = insert(graph2[v], w);
    graph2[w] = insert(graph2[w], v);
  };
  var copy = (g) => g.map((adj) => adj.slice());

  // src/worker/lib/graph/operators.js
  var complement = (g) => {
    g2 = copy(g);
    for (let i = 0; i < g.length - 1; i++) {
      for (let j = i + 1; j < g.length; j++) {
        if (!hasEdge(g, i, j)) {
          addEdge(g2, i, j);
        }
      }
    }
    return g2;
  };
  var inducedGraph = (g, subset) => {
    const reverse = new Array(g.length);
    reverse.fill(-1);
    for (let i = 0; i < subset.length; i++) {
      reverse[subset[i]] = i;
    }
    console.log("g", g, "subset", subset, "reverse", reverse);
    const g22 = graph(subset.length);
    for (let i = 0; i < subset.length; i++) {
      for (u of g[subset[i]]) {
        if (reverse[u] !== -1) {
          addEdge(g22, i, reverse[u]);
        }
      }
    }
    return g22;
  };

  // src/worker/lib/graph/basic.js
  var nbVertices = (graph2) => graph2.length;
  var nbEdges = (graph2) => graph2.flat().length / 2;
  var minDegree = (graph2) => minimum(graph2.map((nbor) => nbor.length));
  var maxDegree = (graph2) => maximum(graph2.map((nbor) => nbor.length));
  var isRegular = (g) => {
    const n = g.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (g[i].length != g[j].length) {
          return { result: false, wtype: "set", witness: [i, j] };
        }
      }
    }
    return { result: true, wtype: "nowitness", witness: [] };
  };
  var isConnected = (graph2) => {
    const visited = new Array(graph2.lenth);
    visited.fill(false);
    const stack = [];
    let nbVisited = 1;
    visited[0] = true;
    stack.push(0);
    while (stack.length > 0) {
      const u2 = stack.pop();
      for (const w of graph2[u2]) {
        if (!visited[w]) {
          stack.push(w);
          visited[w] = true;
          nbVisited++;
        }
      }
    }
    return nbVisited === graph2.length;
  };
  var isHamiltonian = (graph2) => {
    if (graph2.length === 1)
      return { result: true, wtype: "path", witness: [0] };
    if (graph2.length === 2)
      return { result: false, wtype: "nowitness", witness: [] };
    const res = hamiltonAux(graph2, [0]);
    return res ? { result: true, wtype: "path", witness: res } : { result: false, wtype: "nowitness", witness: [] };
  };
  var hamiltonAux = (graph2, path) => {
    const last = path[path.length - 1];
    if (path.length === graph2.length) {
      return hasEdge(graph2, path[0], last) ? path : null;
    } else {
      for (const v of graph2[last]) {
        if (path.includes(v))
          continue;
        const res = hamiltonAux(graph2, path.concat(v));
        if (res) {
          return res;
        }
      }
      return null;
    }
  };
  var degeneracy = (graph2) => {
    const set = new Set(range(0, graph2.length));
    const order = [];
    let maxdegree = 0;
    while (set.size > 0) {
      let minDeg = Infinity;
      let bestVertex = null;
      for (const v of set) {
        const degree = sum(graph2[v].map((u2) => set.has(u2) ? 1 : 0));
        if (degree < minDeg) {
          bestVertex = v;
          minDeg = degree;
        }
      }
      set.delete(bestVertex);
      order.push(bestVertex);
      maxdegree = Math.max(maxdegree, minDeg);
    }
    return { result: maxdegree, wtype: "order", witness: order };
  };
  var eccentricity = (graph2, vertex) => {
    const distance = new Array(graph2.length);
    distance.fill(-1);
    const parent = new Array(graph2.length);
    parent.fill(-1);
    const queue = [];
    let nbVisited = 1;
    distance[vertex] = 0;
    queue.push(vertex);
    while (queue.length > 0) {
      const u2 = queue.shift();
      for (const w of graph2[u2]) {
        if (distance[w] === -1) {
          queue.push(w);
          distance[w] = distance[u2] + 1;
          parent[w] = u2;
          nbVisited++;
        }
      }
    }
    if (nbVisited !== graph2.length) {
      return { result: -1, wtype: "nowitness", witness: [] };
    } else {
      let u2 = maxBy(range(0, graph2.length), (w) => distance[w]);
      const path = [u2];
      while (u2 !== vertex) {
        u2 = parent[u2];
        path.push(u2);
      }
      return { result: path.length - 1, wtype: "path", witness: path.reverse() };
    }
  };
  var alternativePath = (graph2, v1, v2) => {
    const distance = new Array(graph2.length);
    const parent = new Array(graph2.length);
    const queue = [];
    parent.fill(-1);
    distance.fill(-1);
    distance[v1] = 0;
    queue.push(v1);
    while (queue.length > 0) {
      const u2 = queue.shift();
      for (const w of graph2[u2]) {
        if (u2 === v1 && w === v2) {
          continue;
        }
        if (distance[w] === -1) {
          queue.push(w);
          distance[w] = distance[u2] + 1;
          parent[w] = u2;
        }
      }
    }
    if (distance[v2] === -1) {
      return { result: Infinity, witness: null };
    } else {
      const path = [v2];
      let u2 = v2;
      while (u2 !== v1) {
        u2 = parent[u2];
        path.push(u2);
      }
      return { result: path.length - 1, wtype: "path", witness: path };
    }
  };
  var girth = (graph2) => {
    let bestRes = { result: Infinity, witness: null };
    for (const [u2, v] of edges(graph2)) {
      const res = alternativePath(graph2, u2, v);
      if (res.result !== Infinity && res.result + 1 < bestRes.result) {
        bestRes = { result: res.result + 1, witness: res.witness };
      }
    }
    return bestRes;
  };
  var diameter = (graph2) => {
    let bestRes = { result: -1 };
    for (let i = 0; i < graph2.length; i++) {
      const res = eccentricity(graph2, i);
      if (res.result > bestRes.result) {
        bestRes = res;
      }
    }
    return bestRes;
  };
  var mis = (graph2) => {
    let isets = [0];
    let i = 0;
    const nbors = graph2.map((adj) => encode(adj));
    while (true) {
      const isets2 = [];
      for (const iset of isets) {
        const begin = i === 0 ? 0 : 32 - Math.clz32(iset);
        for (let ii = begin; ii < graph2.length; ii++) {
          if ((iset & nbors[ii]) === 0) {
            isets2.push(iset | 1 << ii);
          }
        }
      }
      if (isets2.length === 0) {
        return { result: i, wtype: "set", witness: decode(isets[0]) };
      }
      isets = isets2;
      i++;
    }
  };
  var cliqueNumber = (graph2) => mis(complement(graph2));

  // src/worker/lib/graph/lexbfs.js
  var makePartitions = (nbVertices2) => {
    const partition = {
      new_: false,
      next: null,
      previous: null,
      set: new Set(range(0, nbVertices2))
    };
    return {
      firstPartition: partition,
      partitions: times(() => partition, nbVertices2)
    };
  };
  var firstElement = (partitions) => partitions.firstPartition.set.values().next().value;
  function* execute(partitions, graph2, vertex) {
    let v = vertex;
    while (true) {
      yield v;
      refine(partitions, graph2, v);
      if (partitions.firstPartition === null) {
        return;
      }
      v = firstElement(partitions);
    }
  }
  var addToPartitionBefore = (partitions, partition, vertex) => {
    if (partition.previous === null) {
      partition.previous = {
        new_: true,
        next: partition,
        previous: null,
        set: /* @__PURE__ */ new Set()
      };
    } else if (!partition.previous.new_) {
      partition.previous = {
        new_: true,
        next: partition,
        previous: partition.previous,
        set: /* @__PURE__ */ new Set()
      };
      if (partition.previous.previous) {
        partition.previous.previous.next = partition.previous;
      }
    }
    if (partition === partitions.firstPartition) {
      partitions.firstPartition = partition.previous;
    }
    partition.previous.set.add(vertex);
    partitions.partitions[vertex] = partition.previous;
  };
  var removePartition = (partitions, partition) => {
    if (partition.previous) {
      partition.previous.next = partition.next;
    }
    if (partition.next) {
      partition.next.previous = partition.previous;
    }
    if (partition === partitions.firstPartition) {
      partitions.firstPartition = partition.next;
    }
  };
  var refine = (partitions, graph2, vertex) => {
    const partition = partitions.partitions[vertex];
    partition.set.delete(vertex);
    if (partition.set.size === 0) {
      removePartition(partitions, partition);
    }
    partitions.partitions[vertex] = null;
    for (const u2 of graph2[vertex]) {
      const partition22 = partitions.partitions[u2];
      if (!partition22) {
        continue;
      }
      partition22.set.delete(u2);
      addToPartitionBefore(partitions, partitions.partitions[u2], u2);
    }
    let partition2 = partitions.firstPartition;
    while (partition2) {
      partition2.new_ = false;
      if (partition2.set.size === 0) {
        removePartition(partitions, partition2);
      }
      partition2 = partition2.next;
    }
  };
  var lexbfs_default = (graph2, vertex) => [...execute(makePartitions(graph2.length), graph2, vertex)];

  // src/worker/lib/graph/chordal.js
  var hasClique = (graph2, set) => {
    for (let i = 0; i < set.length - 1; i++) {
      for (let j = i + 1; j < set.length; j++) {
        if (!hasEdge(graph2, set[i], set[j])) {
          return { result: false, witness: [set[i], set[j]] };
        }
      }
    }
    return { result: true, witness: null };
  };
  var isChordal = (graph2) => {
    const lbfs = lexbfs_default(graph2, 0);
    const visited = /* @__PURE__ */ new Set();
    let chordal = true;
    let witness = [];
    for (const v of lbfs) {
      const nbor = graph2[v].filter((u2) => visited.has(u2));
      const res = hasClique(graph2, nbor);
      if (!res.result) {
        chordal = false;
        witness = [v, res.witness[0], res.witness[1]];
        break;
      }
      visited.add(v);
    }
    if (chordal) {
      return { result: true, wtype: "order", witness: lbfs };
    }
    const i = lbfs.indexOf(witness[0]);
    const g22 = inducedGraph(graph2, lbfs.slice(0, i));
    const path = alternativePath(g22, lbfs.indexOf(witness[1]), lbfs.indexOf(witness[2])).witness;
    return {
      result: false,
      wtype: "path",
      witness: path.map((j) => lbfs[j]).concat(witness[0])
    };
  };
  var chordal_default = isChordal;

  // src/worker/lib/graph/coloring.js
  var chromaticNumberAux = (predicate) => (graph2) => {
    let i = 1;
    const precol = new Array(graph2.length);
    precol.fill(-1);
    const uncoloredList = range(0, graph2.length);
    const binNbors = graph2.map(encode);
    while (true) {
      const usedColor = new Array(i);
      usedColor.fill(false);
      const res = chromaticAux(graph2, binNbors, precol, uncoloredList, i, usedColor, predicate);
      if (res) {
        return { result: i, wtype: "color", witness: res };
      }
      i++;
    }
  };
  var chromaticAux = (graph2, binNbors, precoloring, uncolored, maxcolor, usedColor, predicate) => {
    if (uncolored.length === 0)
      return predicate(graph2, binNbors, precoloring) ? precoloring : null;
    const v = minBy(uncolored, (w) => countBy(graph2[w], (u2) => precoloring[u2] !== -1));
    const uncol2 = uncolored.filter((u2) => u2 !== v);
    let newColor = true;
    for (let i = 0; i < maxcolor; i++) {
      if (graph2[v].some((u2) => precoloring[u2] === i) || !usedColor[i] && !newColor) {
        continue;
      }
      let usedColor2;
      if (!usedColor[i]) {
        newColor = false;
        usedColor2 = usedColor.slice();
        usedColor2[i] = true;
      } else {
        usedColor2 = usedColor;
      }
      const precol2 = precoloring.slice();
      precol2[v] = i;
      const res = chromaticAux(graph2, binNbors, precol2, uncol2, maxcolor, usedColor2, predicate);
      if (res) {
        return res;
      }
    }
    return null;
  };
  var coloringClasses = (coloring) => {
    const n = maximum(coloring) + 1;
    const classes = times(() => 0, n);
    for (let i = 0; i < coloring.length; i++) {
      classes[coloring[i]] |= 1 << i;
    }
    return classes;
  };
  var isDominatorColoring = (graph2, binNbors, coloring) => {
    const classes = coloringClasses(coloring);
    return classes.all((clas) => clas !== 0) && coloring.all((color, v) => classes[color] === 1 << v || classes.any((clas) => (binNbors[v] & clas) === clas));
  };
  function isDominatedColoring(graph2, binNbors, coloring) {
    const classes = coloringClasses(coloring);
    return classes.all((clas) => binNbors.any((nbor) => (nbor & clas) === clas, binNbors));
  }
  var chromaticNumber = chromaticNumberAux(() => true);
  var dominatorColoring = chromaticNumberAux(isDominatorColoring);
  var dominatedColoring = chromaticNumberAux(isDominatedColoring);

  // src/worker/lib/graph/domination.js
  var dominatingSet = (graph2) => dominationAux(graph2, [], range(0, graph2.length));
  var dominationAux = (graph2, preset, undom) => {
    if (undom.length === 0) {
      return { result: preset.length, wtype: "set", witness: preset };
    }
    const v = undom[0];
    const nbor = graph2[v].concat(v);
    let bestRes = { result: Infinity };
    for (const u2 of nbor) {
      if (preset.includes(u2))
        continue;
      const undom2 = undom.filter((w) => u2 !== w && !hasEdge(graph2, u2, w));
      const res = dominationAux(graph2, preset.concat(u2), undom2);
      if (res.result < bestRes.result) {
        bestRes = res;
      }
    }
    return bestRes;
  };
  var independentDominatingSet = (graph2) => {
    const nbors = graph2.map(encode);
    let isets = [[0, 0]];
    let i = 0;
    while (true) {
      const isets2 = [];
      for (const [iset, dom] of isets) {
        const begin = i === 0 ? 0 : 32 - Math.clz32(iset);
        for (let ii = begin; ii < graph2.length; ii++) {
          if ((iset & nbors[ii]) === 0) {
            const iset2 = iset | 1 << ii;
            const dom2 = dom | 1 << ii | nbors[ii];
            if (dom2 + 1 === 1 << graph2.length) {
              return { result: i + 1, wtype: "set", witness: decode(iset2) };
            }
            isets2.push([iset2, dom2]);
          }
        }
      }
      isets = isets2;
      i++;
    }
  };
  var totalDominatingSet = (graph2) => totalDominationAux(graph2, [], range(0, graph2.length));
  var totalDominationAux = (graph2, preset, undom) => {
    if (undom.length === 0) {
      return { result: preset.length, wtype: "set", witness: preset };
    }
    const v = undom[0];
    const nbor = graph2[v].concat(v);
    let bestRes = { result: Infinity };
    for (const u2 of nbor) {
      if (preset.includes(u2)) {
        continue;
      }
      const undom2 = undom.filter((w) => !hasEdge(graph2, u2, w));
      const res = totalDominationAux(graph2, preset.concat(u2), undom2);
      if (res.result < bestRes.result) {
        bestRes = res;
      }
    }
    return bestRes;
  };
  var connectedDominatingSet = (graph2) => connectedDominationAux(graph2, [], range(0, graph2.length), /* @__PURE__ */ new Set());
  var connectedDominationAux = (graph2, preset, undom, adj) => {
    if (undom.length === 0) {
      return { result: preset.length, wtype: "set", witness: preset };
    }
    const v = 0;
    const candidates = preset.length === 0 ? new Set(graph2[v].concat(v)) : adj;
    let bestRes = { result: Infinity, witness: null };
    for (const u2 of candidates) {
      const undom2 = undom.filter((w) => u2 !== w && !hasEdge(graph2, u2, w));
      const adj2 = new Set(adj);
      for (const w of graph2[u2]) {
        if (!preset.includes(w)) {
          adj2.add(w);
        }
      }
      adj2.delete(u2);
      const res = connectedDominationAux(graph2, preset.concat(u2), undom2, adj2);
      if (res.result < bestRes.result) {
        bestRes = res;
      }
    }
    return bestRes;
  };

  // src/worker/lib/graph/idcode.js
  var isIdentifyingCode = (g, binNbors, bset) => {
    const nborInSet = [];
    for (let i = 0; i < g.length; i++) {
      const s = binNbors[i] & bset;
      if (s === 0) {
        return false;
      }
      nborInSet.push(s);
    }
    return allDifferent(nborInSet.sort());
  };
  var identifyingCode = (g) => {
    const binNbors = times((j) => encode(g[j].concat(j)), g.length);
    if (!allDifferent(binNbors.sort())) {
      return { result: -1, wtype: "nowitness", witness: [] };
    }
    let i = 1;
    while (true) {
      for (const bset of subsets(g.length, i)) {
        if (isIdentifyingCode(g, binNbors, bset)) {
          return { result: i, wtype: "set", witness: decode(bset) };
        }
      }
      i++;
    }
  };
  var isLocatingDominatingSet = (g, binNbors, bset) => {
    const nborInSet = [];
    for (let i = 0; i < g.length; i++) {
      if ((1 << i & bset) === 0) {
        const s = binNbors[i] & bset;
        if (s === 0) {
          return false;
        }
        nborInSet.push(s);
      }
    }
    return allDifferent(nborInSet.sort());
  };
  var locatingDominatingSet = (g) => {
    const binNbors = [];
    for (const nbor of g) {
      binNbors.push(encode(nbor));
    }
    let i = 1;
    while (true) {
      for (const bset of subsets(g.length, i)) {
        if (isLocatingDominatingSet(g, binNbors, bset)) {
          return { result: i, wtype: "set", witness: decode(bset) };
        }
      }
      i++;
    }
  };

  // src/worker/lib/graph/matching.js
  var greedyMatching = (graph2) => {
    const matching = [];
    const matched = new Array(graph2.length);
    matched.fill(false);
    for (let u2 = 0; u2 < graph2.length - 1; u2++) {
      if (matched[u2]) {
        continue;
      }
      for (const v of graph2[u2]) {
        if (u2 < v && !matched[v]) {
          matching.push([u2, v]);
          matched[u2] = true;
          matched[v] = true;
          break;
        }
      }
    }
    return matching;
  };
  var contract = (graph2, set) => {
    const g22 = copy(graph2);
    const v = set[0];
    const rset = set.slice(1, set.length);
    for (const u2 of rset) {
      g22[u2].length = 0;
    }
    for (let u2 = 0; u2 < graph2.length; u2++) {
      if (rset.includes(u2)) {
        continue;
      }
      const adj = g22[u2];
      const n = g22[u2].length;
      for (let i = 0; i < n; i++) {
        if (rset.includes(adj[i])) {
          adj[i] = v;
        }
      }
    }
    return g22;
  };
  var findAugmentingPath = (graph2, matching) => {
    const parent = new Array(graph2.length);
    const distanceToRoot = new Array(graph2.length);
    const matched = new Array(graph2.length);
    const root = new Array(graph2.length);
    parent.fill(-1);
    distanceToRoot.fill(-1);
    matched.fill(-1);
    root.fill(-1);
    for (const [x, y] of matching) {
      matched[x] = y;
      matched[y] = x;
    }
    for (let i = 0; i < graph2.length; i++) {
      if (matched[i] === -1) {
        distanceToRoot[i] = 0;
        parent[i] = i;
        root[i] = i;
      }
    }
    const unexplored = range(0, graph2.length).filter((w) => matched[w] === -1);
    for (const v of unexplored) {
      if (distanceToRoot[v] % 2 !== 0) {
        continue;
      }
      for (const w of graph2[v]) {
        if (matched[w] === v) {
          continue;
        } else if (root[w] === -1) {
          const x = matched[w];
          parent[w] = v;
          distanceToRoot[w] = distanceToRoot[v] + 1;
          parent[x] = w;
          distanceToRoot[x] = distanceToRoot[w] + 1;
          root[x] = root[w] = root[v];
          unexplored.push(w);
          unexplored.push(x);
        } else if (distanceToRoot[w] % 2 === 0) {
          const path = [];
          let v1 = v;
          while (parent[v1] !== v1) {
            path.unshift(v1);
            v1 = parent[v1];
          }
          path.unshift(v1);
          let w1 = w;
          while (parent[w1] !== w1) {
            path.push(w1);
            w1 = parent[w1];
          }
          path.push(w1);
          if (root[v] !== root[w]) {
            return path;
          } else {
            const g22 = contract(graph2, path);
            const m2 = matching.filter(([x]) => !path.includes(x));
            const path2 = findAugmentingPath(g22, m2);
            if (!path2) {
              return null;
            }
          }
        }
      }
    }
    return null;
  };
  var maximumMatching = (graph2) => {
    let matching = greedyMatching(graph2);
    let path = null;
    while (true) {
      path = findAugmentingPath(graph2, matching);
      if (!path) {
        break;
      }
      const excludeSet = /* @__PURE__ */ new Set();
      for (let i = 0; i < path.length; i++) {
        if (i % 2 === 0) {
          matching.push([path[i], path[i + 1]]);
        } else {
          excludeSet.add(edgeId(graph2, path[i], path[i + 1]));
        }
      }
      matching = matching.filter(([x, y]) => !excludeSet.has(edgeId(graph2, x, y)));
    }
    return { result: matching.length, witness: matching };
  };
  var matching_default = maximumMatching;

  // src/worker/lib/graph/treewidth.js
  var Q = (g, set, v) => {
    const visited = new Array(g.length);
    const inset = new Array(g.length);
    visited.fill(false);
    inset.fill(false);
    for (const x of set)
      inset[x] = true;
    const queue = [];
    let nbVisited = 0;
    queue.push(v);
    visited[v] = true;
    while (queue.length > 0) {
      const u2 = queue.shift();
      for (const w of g[u2]) {
        if (!visited[w]) {
          visited[w] = true;
          if (inset[w]) {
            queue.push(w);
          } else {
            nbVisited++;
          }
        }
      }
    }
    return nbVisited;
  };
  var treewidth = (g) => {
    const n = g.length;
    let up = n - 1;
    const tw = times(() => /* @__PURE__ */ new Map(), n + 1);
    tw[0].set(0, -Infinity);
    for (let i = 1; i <= n; i++) {
      for (const [setid, r] of tw[i - 1].entries()) {
        const set = decode(setid);
        const inset = new Array(n);
        inset.fill(false);
        for (const u2 of set) {
          inset[u2] = true;
        }
        for (let x = 0; x < n; x++) {
          if (inset[x]) {
            continue;
          }
          const q = Q(g, set, x);
          const r2 = Math.max(q, r);
          if (r2 < up) {
            up = Math.min(up, n - set.length - 1);
            const setid2 = setid | 1 << x;
            const t = tw[i].get(setid2);
            if (t === void 0 || t > r2) {
              tw[i].set(setid2, r2);
            }
          }
        }
      }
    }
    const vcId = encode(range(0, n));
    return tw[n].get(vcId) || up;
  };
  var treewidth_default = treewidth;

  // src/worker/worker.js
  var functions = {
    order: nbVertices,
    nbedges: nbEdges,
    mindegree: minDegree,
    maxdegree: maxDegree,
    degen: degeneracy,
    diameter,
    girth,
    matching: matching_default,
    tw: treewidth_default,
    regular: isRegular,
    connected: isConnected,
    hamilton: isHamiltonian,
    chordal: chordal_default,
    mis,
    clique: cliqueNumber,
    chromatic: chromaticNumber,
    dom: dominatingSet,
    totaldom: totalDominatingSet,
    inddom: independentDominatingSet,
    cdom: connectedDominatingSet,
    idcode: identifyingCode,
    locdom: locatingDominatingSet
  };
  self.onmessage = (msg) => {
    const { graph: graph2, param } = msg.data;
    console.log(graph2, param);
    const fn = functions[param];
    const result = fn(graph2);
    const result2 = typeof result === "boolean" || typeof result === "number" ? { result, wtype: "nowitness", witness: [] } : result;
    const result3 = result2.result === Infinity ? { result: -1, witness: result2.witness } : result2;
    console.log({ param, result: result3 });
    self.postMessage({ ...result3, result: "" + result3.result });
  };
})();
