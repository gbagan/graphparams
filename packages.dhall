let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.12-20231112/packages.dhall
        sha256:7d85bcd74b10b0acffceb2f3f90cd4c225a2d934578ea67b322f42fde945d242

let additions =
      { relude =
        { dependencies =
          [ "aff"
          , "arrays"
          , "control"
          , "effect"
          , "either"
          , "foldable-traversable"
          , "generate-values"
          , "integers"
          , "lazy"
          , "lists"
          , "maybe"
          , "numbers"
          , "ordered-collections"
          , "prelude"
          , "profunctor-lenses"
          , "transformers"
          , "tuples"
          , "unfoldable"
          ]
        , repo = "https://github.com/gbagan/purescript-relude.git"
        , version = "master"
        }
      }

in upstream // additions