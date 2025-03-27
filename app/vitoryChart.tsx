import { View } from "react-native"
import { CartesianChart, Bar, Line } from "victory-native";
const VictoryChart = () => {

    return (
        <View style={{height: 300, width: 300}}>
            <CartesianChart data={DATA} xKey="day" yKeys={["lowTmp", "highTmp"]}>
                {({ points, chartBounds }) => (
                    <Line 
                        points={points.highTmp}
                        barWidth={10}
                        color={"blue"}
                     /> 
                )}
            </CartesianChart>
        </View>
    )
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    lowTmp: 20 + 10 * Math.random(),
    highTmp: 40 + 30 * Math.random(),
  }));

export default VictoryChart