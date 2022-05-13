{ name = "graphparams"
, dependencies =
  [ "arrays"
  , "effect"
  , "integers"
  , "lazy"
  , "lists"
  , "maybe"
  , "pha"
  , "prelude"
  , "tuples"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
