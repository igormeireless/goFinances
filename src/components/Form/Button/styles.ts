import styled from 'styled-components/native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerProps extends RectButtonProps {
    children: React.ReactNode;
}

export const Container = styled(RectButton)<ContainerProps>`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.secondary};

    border-radius: ${RFValue(5)}px;

    align-items: center;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.medium};
    font-size: ${RFValue(14)}px;

    color: ${({ theme }) => theme.colors.shape};

    padding: ${RFValue(18)}px;
`;