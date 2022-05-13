module GraphParams.View
  ( htmlizedHelp
  , outputParameter
  , view
  )
  where
-- import style from '../css/style.scss';

import Prelude
import Data.Array ((..), filter, zipWith)
import Data.Maybe (Maybe(..))
import Pha.Html (Html)
import Pha.Html as H
import Pha.Html.Attributes as P
import Pha.Html.Events as E
import GraphParams.Model (Model, Parameter, Result, Witness(..), Msg(..), parameters)
import GraphParams.GraphView (graphView)

htmlizedHelp :: forall a. Array (Html a) 
htmlizedHelp = []
     --   {HELP_TEXT.split("\n") >>= \line [H.text line, H.br]

view :: Model -> Html Msg
view model@{error, isComputing, code, results} =
    H.div [H.class_ "graphparams-layout"]
    [   H.div [H.class_ "graphparams-mainrow"]
        [   H.div [] -- col span={17}>
            [   H.div []
                [   H.button [P.disabled isComputing, E.onClick \_ -> SelectAllParams] [H.text "Select All"]
                ,   H.button [P.disabled isComputing, E.onClick \_ -> UnselectAllParams] [H.text "Unselect All"]
                ,   H.button [P.disabled isComputing, E.onClick \_ -> Compute] [H.text "Compute"]
                -- ,   H.bButton [P.disabled $ not computing, E.onClick UnselectAll] [H.text "Compute"]
                ]
            ,   paramInput
            ,   H.div [H.class_ "graphparams-mainrow"]
                [   H.div [] -- col
                    []   --Input.TextArea className={style.code} rows="15" cols="40" onChange={handleCodeChange} value={code} />
                ,   H.div [] -- Col
                    [   H.div [] -- Card title="Output">
                        [   output]
                    ,   H.div [] -- Card title="Graph">
                        [   graphView model]
                    ]
                ]
            ]
        ,   H.div [] -- <Col>
            [   H.div [] -- Card title="Help">
                [   H.div [H.class_ "graphparams-help"] htmlizedHelp
                ]
            ]
        ]
    ]
    where
    output =
        H.div [H.class_ "graphparams-output"] $
            case error of
                Just err ->
                    [H.span [] [H.text err]] 
                Nothing ->
                    zipWith outputParameter parameters results
                    --    {- filter (\p -> p.result /= null) -} # map \(param /\ result) ->
                    --    outputParameter param result

    paramInput =
        H.div [] $ -- row divStyle 
            1..4 <#> \i ->
                H.div [H.class_ "graphparams-row"] $
                    parameters # filter (\p -> p.cat == i) # map \{fullname} ->
                        H.div [] [H.input [P.type_ "checkbox"], H.text fullname]
                        -- <ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter} />


outputParameter :: Parameter → Maybe Result → Html Msg
outputParameter parameter@{fullname} result =
    case result of 
        Nothing -> H.span [] []
        Just {value, witness} ->
            H.div []
            [   --if result == "computing" then
                --    H.span [] [H.text $ fullname <> " : Computing"]
                if witness == NoWitness then
                    H.span [] [H.text $ fullname <> " : " <> value]
                else
                    H.a [P.href "#", E.onPointerOver \_ -> ShowWitness witness, E.onPointerOut \_ -> ShowWitness NoWitness]
                    [   H.span [] [H.text $ fullname <> " : " <> value]]
            ,   H.br
            ]

    -- const divStyle = { width: "100%", height: "100%" }

