module GraphParams.Model where

import Relude
import Data.Map as Map
import GraphParams.Graph (Graph, Edge)
import GraphParams.Data (codeExample)

data EditMode = MoveMode | VertexMode | AddEMode | DeleteMode
derive instance Eq EditMode

type Position = { x ∷ Number, y ∷ Number}

type Model =
  { certificate ∷ Certificate
  , isComputing ∷ Boolean
  , code ∷ String
  , error ∷ Maybe String
  , parameters ∷ Array Parameter
  , results ∷ Map String Result
  , graph ∷ Graph
  , editmode ∷ EditMode
  , selectedVertex ∷ Maybe Int
  , currentPosition ∷ Maybe Position
  }

init ∷ Model
init =
  { certificate: NoCertificate
  , isComputing: false
  , code: codeExample
  , error: Nothing
  , parameters
  , results: Map.empty
  , graph: {layout: [], edges: []}
  , editmode: VertexMode
  , selectedVertex: Nothing
  , currentPosition: Nothing
  }

type Parameter =
  { cat ∷ Int
  , name ∷ String
  , hardness ∷ Int
  , fullname ∷ String
  , selected ∷ Boolean
  }

type Result =
  { value ∷ String
  , certificate ∷ Certificate
  }

data Certificate 
  = NoCertificate 
  | ColorCertificate (Array Int)
  | Certificate (Array Int) (Array Edge)
  | OrderCertificate (Array Int)
 
derive instance Eq Certificate

parameters ∷ Array Parameter
parameters = 
  [ { cat: 1, hardness: 0, name: "order", fullname: "order" }
  , { cat: 1, hardness: 0, name: "nbedges", fullname: "number of edges" }
  , { cat: 1, hardness: 0, name: "mindegree", fullname: "minimun degree" }
  , { cat: 1, hardness: 0, name: "maxdegree", fullname: "maximum degree" }
  , { cat: 1, hardness: 0, name: "degen", fullname: "degeneracy" }
  , { cat: 1, hardness: 0, name: "diameter", fullname: "diameter" }
  , { cat: 1, hardness: 0, name: "girth", fullname: "girth" }
  , { cat: 1, hardness: 0, name: "matching", fullname: "maximum matching" }
  , { cat: 1, hardness: 2, name: "tw", fullname: "treewidth" }

  , { cat: 2, hardness: 0, name: "regular", fullname: "regular" }
  , { cat: 2, hardness: 0, name: "connected", fullname: "connected" }
  , { cat: 2, hardness: 1, name: "hamilton", fullname: "hamiltonian" }
  , { cat: 2, hardness: 0, name: "chordal", fullname: "chordal" }

  , { cat: 3, hardness: 1, name: "mis", fullname: "independent set" }
  , { cat: 3, hardness: 1, name: "clique", fullname: "clique" }
  , { cat: 3, hardness: 1, name: "chromatic", fullname: "chromatic number" }
  , { cat: 4, hardness: 1, name: "dom", fullname: "dominating set" }
  , { cat: 4, hardness: 1, name: "totaldom", fullname: "total dominating set" }
  , { cat: 4, hardness: 1, name: "inddom", fullname: "independent dominating set" }
  , { cat: 4, hardness: 2, name: "cdom", fullname: "connected dominating set" }
  , { cat: 4, hardness: 1, name: "idcode", fullname: "identifying code" }
  , { cat: 4, hardness: 1, name: "locdom", fullname: "locating dominating set" }
  ] <#> \{cat, hardness, name, fullname} → { cat, hardness, name, fullname, selected: hardness <= 1}

