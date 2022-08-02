import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const theme = useTheme();

    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarLabelPosition: 'beside-icon',
                tabBarLabelStyle: {
                    fontFamily: theme.fonts.medium,
                    fontSize: 14
                },
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0
                }
            }}
        >
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ color }) => 
                        <Feather
                            name="list"
                            size={24}
                            color={color}
                        />
                    )
                }}
            />

            <Screen
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ color }) => 
                        <Feather
                            name="dollar-sign"
                            size={24}
                            color={color}
                        />
                    )
                }}
            />

            <Screen
                name="Resumo"
                component={Resume}
                options={{
                    tabBarIcon: (({ color }) => 
                        <Feather
                            name="pie-chart"
                            size={24}
                            color={color}
                        />
                    )
                }}
            />
        </Navigator>
    );
}