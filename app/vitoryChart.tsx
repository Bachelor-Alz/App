import { View } from "react-native"
import { VictoryChart, VictoryLine } from "victory-native";

const VictoryCharts = () => {
    return (
        <View style={{ height: 300 }}>
            <VictoryChart>
                <VictoryLine
                    data={DATA}
                    x="day"
                    y="highTmp"
                />
            </VictoryChart>
      </View>
      );
}


const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random(),
  }));



export default VictoryCharts