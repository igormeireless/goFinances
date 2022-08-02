import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

interface TransactionsData {
    amount: number;
    category: string;
    date: string;
    id: string;
    name: string;
    type: string,
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'up' | 'down'
        ) {
        const collectionFilttered = collection
        .filter(transaction => transaction.type == type && 
            new Date(transaction.date).getMonth() === new Date().getMonth() &&
            new Date(transaction.date).getFullYear() === new Date().getFullYear()
        );        

        if(collectionFilttered.length === 0) {
            return 0;
        }

        const lastTransaction =
                Math.max.apply(Math,
                    collectionFilttered
                    .map(transaction => new Date(transaction.date).getTime()));

        return Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long'
        }).format(new Date(lastTransaction));
    }
    
    async function loadTransaction() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions: DataListProps[] = response ? JSON.parse(response) : [];

        let entriesTotal = 0; 
        let expensiveTotal = 0; 

        const collectionFilttered = transactions
        .filter(transaction => new Date(transaction.date).getMonth() === new Date().getMonth() &&
        new Date(transaction.date).getFullYear() === new Date().getFullYear()
        );  

        const transactionsFormatted = collectionFilttered
            .map(item => {

                if(item.type === 'up') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const date = Intl.DateTimeFormat('pt-Br', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            });

            setTransactions(transactionsFormatted);
            
            const lastTransactonEntries = getLastTransactionDate(transactions, 'up');
            const lastTransactionExpensives = getLastTransactionDate(transactions, 'down');
            const totalInterval = `01 a ${new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'long'
            }).format(new Date())}`;

            const total = entriesTotal - expensiveTotal;

            setHighlightData({
                entries: {
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: lastTransactonEntries === 0 
                    ? 'Não há transações' 
                    : `Última entrada dia ${lastTransactonEntries}`
                },
                expensives: {
                    amount: expensiveTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: lastTransactionExpensives === 0 
                    ? 'Não há transações' 
                    : `Última saída dia ${lastTransactionExpensives}`
                },
                total: {
                    amount: total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: totalInterval
                }
            }); 
            
            setIsLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: user.photo }} />

                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>{user.name}</UserName>
                        </User>
                    </UserInfo>
                    
                    <LogoutButton onPress={signOut}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            {   
                isLoading ? 
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> :
                <>
                    <HighlightCards>
                        <HighlightCard
                            title="Entradas"
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                            type="up"
                        />

                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                            type="down"
                        />

                        <HighlightCard
                            title="Total"
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                            type="total"
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                            
                        />

                    </Transactions>
                </>
            }
        </Container>
    );
}