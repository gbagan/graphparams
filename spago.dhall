{ name = "graphparams"
, dependencies =
  [ "aff"
  , "arrays"
  , "avar"
  , "bifunctors"
  , "control"
  , "either"
  , "foldable-traversable"
  , "foreign"
  , "integers"
  , "lists"
  , "numbers"
  , "ordered-collections"
  , "pha"
  , "relude"
  , "string-parsers"
  , "strings"
  , "tailrec"
  , "transformers"
  , "web-dom"
  , "web-events"
  , "web-pointerevents"
  , "web-uievents"
  , "web-workers"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
