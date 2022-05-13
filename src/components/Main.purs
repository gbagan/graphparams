module GraphParams.View where
-- import style from '../css/style.scss';

import Prelude
import Data.Array (filter)
import Data.Maybe (Maybe(..))
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E
import GraphParams.Model (Model, Witness(..), Msg(..))
import GraphParams.GraphView (graphView)

htmlizedHelp :: forall a. Array (Html a) 
htmlizedHelp = []
     --   {HELP_TEXT.split("\n") >>= \line [H.text line, H.br]

view :: Model -> Html Msg
view model@{isComputing, code} =
    H.div [H.class_ "graphparams-layout"]
    [   H.div [] -- row type="flex" justify="space-between" align="top">
        [   H.div [] -- col span={17}>
            [   H.div []
                [   H.button [P.disabled isComputing, E.onClick SelectAllParams] [H.text "Select All"]
                ,   H.button [P.disabled isComputing, E.onClick UnselectAllParams] [H.text "Unselect All"]
                ,   H.button [P.disabled isComputing, E.onClick Compute] [H.text "Compute"]
                -- ,   H.bButton [P.disabled $ not computing, E.onClick UnselectAll] [H.text "Compute"]
                ]
            ,   H.div [] -- [paramInput]
            ,   H.div [] --Row type="flex" justify="space-around" align="top">
                [   H.div [] -- col
                    []   --Input.TextArea className={style.code} rows="15" cols="40" onChange={handleCodeChange} value={code} />
                ,   H.div [] -- Col
                    [   H.div [] -- Card title="Output">
                        [   output]
                    ,   H.div [] -- Card title="Graph">
                        [   graphView]
                    ]
                ]
            ]
        ,    h.div [] -- <Col>
            [   H.div [] -- Card title="Help">
                [   H.div [H.class_ "graphparams-help"] htmlizedHelp
                ]
            ]
        ]
    ]



output :: Model -> Html Msg
output model@{parameters, error} =
    H.div [H.class_ "graphparams-out"] $
        case error of
            Just err ->
                [H.span [] [H.text err]] 
            Nothing ->
                parameters {- filter (\p -> p.result /= null) -} # map \param ->
                    outputParameter param

outputParameter parameter@{result, fullname} =
    case result of 
        Nothing -> H.span [] []
        Just res ->
            [   if result == "computing" then
                    H.span [] [H.text $ fullname <> " : Computing"]
                else if result.witness == NoWitness then
                    H.span [] [H.text $ fullname <> " : " <> result.result.toString]
                else
                    H.a [P.href "#", E.onPointerOver \_ -> ShowWitness result.witness, E.onPointerOut \_ -> ShowWitness NoWitness]
                [   H.span [H.text $ fullname <> " : " <> result.result.toString]]
            ,   H.br
            ]

    -- const divStyle = { width: "100%", height: "100%" }
{-
paramInput {parameters} =
    H.div [] -- row divStyle 
        1..4 <#> \i ->
            <Col span={6}>
            {
                parameters.filter(p => p.cat === i).map(param =>
                    <ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter} />
                )
            }
-}