import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Project/LoginScreen";
import RegisterScreen from "./Project/RegisterScreen";
import HomePage from "./Project/HomePage";
import Tabs from "./Project/Tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Test from "./Project/Test";
import Drawers from "./Project/Drawers";
import Scan from "./Project/Scan";
import ChatbotScreen from "./Project/ChatbotScreen";
import Profile from "./Project/Profile";
import Addsemester from "./Project/Addsemester";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}} initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Drawers"
          component={Drawers}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Scan"
          component={Scan}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ChatbotScreen"
          component={ChatbotScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Addsemester"
          component={Addsemester}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
