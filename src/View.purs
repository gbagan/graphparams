module GraphParams.View (view) where

import Prelude
import Data.Array ((..), filter, null, zipWith)
import Data.Maybe (Maybe(..))
import Data.String (split, Pattern(..))
import Effect (Effect)
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E
import Web.Event.Event (Event)

import GraphParams.Data (helpText)
import GraphParams.Model (Model, Parameter, Result, Witness(..))
import GraphParams.Msg (Msg(..))
import GraphParams.GraphView (graphView)

foreign import slStringValue ∷ Event → Effect String

foreign import slChecked ∷ Event → Effect Boolean

htmlizedHelp :: forall a. Array (Html a)
htmlizedHelp = helpText # split (Pattern "\n") >>= \line -> [ H.text line, H.br ]

view :: Model -> Html Msg
view model@{ error, isComputing, code, parameters, results, graph } =
  H.div [ H.class_ "row row-top space-between" ]
    [ H.div [ H.class_ "col col-17" ]
        [ H.div [ H.class_ "row" ]
            [ H.elem "sl-button-group" []
                [ H.elem "sl-button"
                    [ P.disabled isComputing
                    , E.onClick \_ -> SelectAllParams
                    ]
                    [ H.text "Select All" ]
                , H.elem "sl-button"
                    [ P.disabled isComputing
                    , E.onClick \_ -> UnselectAllParams
                    ]
                    [ H.text "Unselect All" ]
                , H.elem "sl-button"
                    [ P.disabled $ isComputing || null (graph.layout)
                    , E.onClick \_ -> Compute
                    ]
                    [ H.text "Compute" ]
                -- ,   H.bButton [P.disabled $ not computing, E.onClick UnselectAll] [H.text "Compute"]
                ]
            ]
        , paramInput
        , H.div [ H.class_ "row row-top space-around" ]
            [ H.div [ H.class_ "col" ] -- col
                [ H.elem "sl-textarea"
                    [ P.rows 15
                    , P.cols 40
                    , P.value code
                    , E.on "sl-change" \ev → Just <$> SetCode <$> slStringValue ev
                    ]
                    []
                , H.elem "sl-button" [ E.onClick \_ -> GenerateGraph ] [ H.text "Generate" ]
                ]
            , H.elem "sl-card" []
                [ H.div [ H.attr "slot" "header" ] [ H.text "Ouput" ]
                , output
                ]
            , H.elem "sl-card" []
                [ H.div [ H.attr "slot" "header" ] [ H.text "Graph" ]
                , graphView model
                ]
            ]
        ]
    , H.div [ H.class_ "graphparams-help-container" ]
        [ H.elem "sl-card" []
            [ H.div [ H.attr "slot" "header" ] [ H.text "Help" ]
            , H.div [ H.class_ "graphparams-help" ] htmlizedHelp
            ]
        ]
    ]
  where
  output =
    H.div [ H.class_ "graphparams-output" ]
      $ case error of
          Just err -> [ H.span [] [ H.text err ] ]
          Nothing -> zipWith outputParameter parameters results

  --    {- filter (\p -> p.result /= null) -} # map \(param /\ result) ->
  --    outputParameter param result
  paramInput =
    H.div [ H.class_ "row row-top space-between" ]
      $ (1 .. 4)
      <#> \i ->
          H.div [ H.class_ "col col-6" ]
            $ parameters
            # filter (\p -> p.cat == i)
            # map \{ fullname, selected } ->
                H.div []
                  [ H.elem "sl-checkbox" [ P.checked selected ] [ H.text fullname ]
                  ]

outputParameter :: Parameter → Maybe Result → Html Msg
outputParameter { fullname } result = case result of
  Nothing -> H.span [] []
  Just { value, witness } ->
    H.div []
      [ if witness == NoWitness then
          H.span [] [ H.text $ fullname <> " : " <> value ]
        else
          H.a [ P.href "#", E.onPointerOver \_ -> ShowWitness witness, E.onPointerOut \_ -> ShowWitness NoWitness ]
            [ H.span [] [ H.text $ fullname <> " : " <> value ] ]
      , H.br
      ]
