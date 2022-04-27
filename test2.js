<Modal
    visible={isPictureModalVisible}
    onDismiss={() => setIsPictureModalVisible(false)}
    contentContainerStyle={styles.modal}>
    <Card>
        <Card.Title
            title={I18n.t('update_picture')}
            subtitle=""
            left={() => <Avatar.Icon size={24} icon="account-edit" />}
        />
        <Card.Content>
            <View
                style={{
                    paddingTop: 6,
                    marginTop: 20,
                    alignItems: 'center',
                }}>
                <Image style={styles.stretch} source={{uri: fileUri}} />

                <View
                    style={{
                        height: 50,
                        backgroundColor: errorPic !== '' ? '#007bff' : 'white',
                        backgroundColor: error !== '' ? '#a3cbf6' : 'white',
                        alignItems: 'center',
                        paddingTop: 6,
                        width: 300,
                        paddingTop: 4,
                    }}>
                    <Text style={{color: 'white', fontSize: 16}}>
                        {errorPic}
                        {error}
                    </Text>
                </View>
            </View>
            <View style={{height: 50}}>
                <ActivityIndicator
                    animating={updatingProfile}
                    color="#007bff"
                    size="large"
                    style={styles.activityIndicator}
                />
            </View>
        </Card.Content>
        <Card.Actions>
            <Button
                icon="close"
                mode="container"
                onPress={() => setIsPictureModalVisible(false)}>
                {I18n.t('cancel')}
            </Button>
            <Button
                mode="container"
                onPress={() => updateProfileImage()}
                style={{marginLeft: variables.deviceWidth / 2.2}}>
                {I18n.t('update')}
            </Button>
        </Card.Actions>
    </Card>
</Modal>
