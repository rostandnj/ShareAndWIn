

<View style={stylesItem.commentInput}>
    <TextInput
        style={[stylesItem.commentInputWrapper]}
        placeholder={
            showSubComment === -1
                ? I18n.t('comment_post')
                : I18n.t('respond_to_comment')
        }
        placeholderTextColor="#000"
        keyboardType="default"
        onSubmitEditing={Keyboard.dismiss}
        blurOnSubmit={false}
        underlineColorAndroid="#f000"
        returnKeyType="next"
        label="Message"
        value={props.commentMsg}
        onChangeText={(text) => props.setCommentMsg(text)}
    />
</View>
