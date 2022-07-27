import styled from 'styled-components/native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerProps extends RectButtonProps {
    children: React.ReactNode;
}

export const Container = styled(RectButton).attrs({
    activeOpacity: 0.7,
})<ContainerProps>`
    background-color: ${({ theme }) => theme.colors.shape};

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    border-radius: ${RFValue(5)}px;

    padding: 18px 16px;
`;

export const Category = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.text};
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.colors.text};
`;