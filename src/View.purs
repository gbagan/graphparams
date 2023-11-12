module GraphParams.View (view) where

import Prelude

import Data.Array ((..), filter, null)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.String (split, Pattern(..))
import GraphParams.Data (helpText)
import GraphParams.GraphView (graphView)
import GraphParams.Model (Model, Parameter, Result, Certificate(..))
import GraphParams.Msg (Msg(..))
import GraphParams.UI as UI
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E

htmlizedHelp ∷ forall a. Array (Html a)
htmlizedHelp = helpText # split (Pattern "\n") >>= \line → [ H.text line, H.br ]

view ∷ Model → Html Msg
view model@{ error, isComputing, code, parameters, results, graph } =
  H.div [ H.class_ "flex flex-row justify-between" ]
    [ H.div [ H.class_ "w-3/4" ]
        [ H.div [ H.class_ "row" ]
            [ UI.buttonGroup
                [ { name: "SelectAll"
                  , onClick: SelectAllParams
                  , attrs: [ P.disabled isComputing ]
                  }
                , { name: "Unselect All"
                  , onClick: UnselectAllParams
                  , attrs: [ P.disabled isComputing ]
                  }
                , { name: "Compute"
                  , onClick: Compute
                  , attrs: [ P.disabled $ isComputing || null (graph.layout) ]
                  }
                -- ,   H.bButton [P.disabled $ not computing, E.onClick UnselectAll] [H.text "Compute"]
                ]
            ]
        , paramInput
        , H.div [ H.class_ "flex flex-row justify-around" ]
            [ H.div [ H.class_ "flex flex-col items-start" ]
                [ H.textarea
                    [ H.class_ UI.textareaClass
                    , P.rows 15
                    , P.cols 30
                    , P.value code
                    , E.onValueChange SetCode
                    ]
                , UI.button
                    { name: "Generate"
                    , onClick: GenerateGraph
                    , attrs: [P.disabled isComputing]
                    }
                ]
            , UI.card "Output" [output]
            , UI.card "Graph" [graphView model]
            ]
        ]
    , H.div [ H.class_ "graphparams-help-container" ]
        [ UI.card "Help" [H.div [ H.class_ "graphparams-help" ] htmlizedHelp]
        ]
    ]
  where
  output =
    H.div [ H.class_ "graphparams-output" ]
      $ case error of
          Just err → [ H.span [] [ H.text err ] ]
          Nothing →
            parameters
              <#> \parameter@{ name, selected } →
                  H.when selected \_ →
                    outputParameter parameter (Map.lookup name results)

  paramInput =
    H.div [ H.class_ "flex flex-row justify-around" ]
      $ (1 .. 4)
      <#> \i →
          H.div [ H.class_ "flex flex-col w-1/4 ml-4" ]
            $ parameters
            # filter (\p → p.cat == i)
            # map \{ name, fullname, selected } →
                H.label []
                  [ H.input
                      [ P.type_ "checkbox"
                      , H.class_ UI.checkboxClass
                      , P.checked selected
                      , E.onChecked $ CheckParam name ]
                  , H.span [ H.class_ "ml-2 text-sm font-medium text-gray-900" ] [ H.text fullname ]
                  ]

outputParameter ∷ Parameter → Maybe Result → Html Msg
outputParameter { fullname } result = case result of
  Nothing → H.span [] []
  Just { value, certificate } →
    H.div []
      [ if certificate == NoCertificate then
          H.span [] [ H.text $ fullname <> " : " <> value ]
        else
          H.a
            [ H.class_ "font-medium text-blue-600 hover:underline"
            , P.href "#"
            , E.onPointerOver \_ → ShowCertificate certificate
            , E.onPointerOut \_ → ShowCertificate NoCertificate
            ]
            [ H.span [] [ H.text $ fullname <> " : " <> value ] ]
      , H.br
      ]
