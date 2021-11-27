// Import React and required components
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { authorize, prefetchConfiguration, refresh, revoke } from 'react-native-app-auth';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Button, ButtonContainer, Form, FormLabel, FormValue, Heading, Page } from './components';

const configs = {
    identityserver: {
        issuer: 'https://demo.identityserver.io',
        clientId: 'interactive.public',
        redirectUrl: 'io.identityserver.demo:/oauthredirect',
        additionalParameters: {},
        scopes: ['openid', 'profile', 'email', 'offline_access'],

        // serviceConfiguration: {
        //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
        //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
        //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
        // }
    },
    auth0: {
        // From https://openidconnect.net/
        issuer: 'https://samples.auth0.com',
        clientId: 'kbyuFDidLLm280LIwVFiazOqjO3ty8KH',
        redirectUrl: 'https://openidconnect.net/callback',
        additionalParameters: {},
        scopes: ['openid', 'profile', 'email', 'phone', 'address'],

        // serviceConfiguration: {
        //   authorizationEndpoint: 'https://samples.auth0.com/authorize',
        //   tokenEndpoint: 'https://samples.auth0.com/oauth/token',
        //   revocationEndpoint: 'https://samples.auth0.com/oauth/revoke'
        // }
    }
};

const defaultAuthState = {
    hasLoggedInOnce: false,
    provider: '',
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: ''
};


const OAuth = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const [authState, setAuthState] = useState(defaultAuthState);
    React.useEffect(() => {
        prefetchConfiguration({
            warmAndPrefetchChrome: true,
            ...configs.identityserver
        });
    }, []);

    const handleAuthorize = useCallback(
        async provider => {
            try {
                const config = configs[provider];
                const newAuthState = await authorize(config);

                setAuthState({
                    hasLoggedInOnce: true,
                    provider: provider,
                    ...newAuthState
                });
            } catch (error) {
                Alert.alert('Failed to log in', error.message);
            }
        },
        [authState]
    );

    const handleRefresh = useCallback(async () => {
        try {
            const config = configs[authState.provider];
            const newAuthState = await refresh(config, {
                refreshToken: authState.refreshToken
            });

            setAuthState(current => ({
                ...current,
                ...newAuthState,
                refreshToken: newAuthState.refreshToken || current.refreshToken
            }))

        } catch (error) {
            Alert.alert('Failed to refresh token', error.message);
        }
    }, [authState]);

    const handleRevoke = useCallback(async () => {
        try {
            const config = configs[authState.provider];
            await revoke(config, {
                tokenToRevoke: authState.accessToken,
                sendClientId: true
            });

            setAuthState({
                provider: '',
                accessToken: '',
                accessTokenExpirationDate: '',
                refreshToken: ''
            });
        } catch (error) {
            Alert.alert('Failed to revoke token', error.message);
        }
    }, [authState]);

    const showRevoke = useMemo(() => {
        if (authState.accessToken) {
            const config = configs[authState.provider];
            if (config.issuer || config.serviceConfiguration.revocationEndpoint) {
                return true;
            }
        }
        return false;
    }, [authState]);


    return (
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Text style={styles.sectionTitle}>
                Auth in React Native react-native-app-auth
            </Text>
            <Text>https://github.com/FormidableLabs/react-native-app-auth/blob/main/Example/App.js</Text>
           
            <Page>
                {!!authState.accessToken ? (
                    <Form>
                        <FormLabel>accessToken</FormLabel>
                        <FormValue>{authState.accessToken}</FormValue>
                        <FormLabel>accessTokenExpirationDate</FormLabel>
                        <FormValue>{authState.accessTokenExpirationDate}</FormValue>
                        <FormLabel>refreshToken</FormLabel>
                        <FormValue>{authState.refreshToken}</FormValue>
                        <FormLabel>scopes</FormLabel>
                        <FormValue>{authState.scopes.join(', ')}</FormValue>
                    </Form>
                ) : (
                    <Heading>{authState.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Heading>
                )}

                <ButtonContainer>
                    {!authState.accessToken ? (
                        <>
                            <Button
                                onPress={() => handleAuthorize('identityserver')}
                                text="Authorize IdentityServer"
                                color="#DA2536"
                            />
                            <Button
                                onPress={() => handleAuthorize('auth0')}
                                text="Authorize Auth0"
                                color="#DA2536"
                            />
                        </>
                    ) : null}
                    {!!authState.refreshToken ? (
                        <Button onPress={handleRefresh} text="Refresh" color="#24C2CB" />
                    ) : null}
                    {showRevoke ? (
                        <Button onPress={handleRevoke} text="Revoke" color="#EF525B" />
                    ) : null}
                </ButtonContainer>
            </Page>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
});

export default OAuth;