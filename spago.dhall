{ name = "graphparams"
, dependencies =
  [ "aff"
  , "arrays"
  , "effect"
  , "integers"
  , "maybe"
  , "parsing"
  , "pha"
  , "prelude"
  , "strings"
  , "tailrec"
  , "transformers"
  , "tuples"
  , "web-dom"
  , "web-events"
  , "web-pointerevents"
  , "web-uievents"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
