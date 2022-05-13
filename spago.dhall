{ name = "graphparams"
, dependencies =
  [ "aff"
  , "arrays"
  , "effect"
  , "foldable-traversable"
  , "integers"
  , "maybe"
  , "pha"
  , "prelude"
  , "tuples"
  , "web-dom"
  , "web-events"
  , "web-pointerevents"
  , "web-uievents"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
