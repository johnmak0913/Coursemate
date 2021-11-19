import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableHighlight} from 'react-native';
import {Button} from "../components";
import { Colors } from '../styles';

import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import * as firebase from 'firebase';

export const AllGroups = ({navigation}) => {
    const db = firebase.database();
    const { user } = useContext(AuthenticatedUserContext);
    const username = user.email.substring(0,user.email.length-10);
    const ref = db.ref(`users/${username}/groups`);

    const [groupList, setGroupList] = useState([]);
    const [groupCount, setGroupCount] = useState(0);

    let fetchGroup = async () => {
        return ref.once("value")
            .then( (snapshot) => {
                setGroupList(snapshot.val());
                setGroupCount(snapshot.val().length);
            });
    };

    useEffect( () => {
        ref.on('value', snapshot => {
            fetchGroup().then();
        });
        // return () => ref.off('value', onValueChange);
    }, []);

    return (
        <ScrollView style={{padding: 20}}>
            <Text style={styles.h1}>Your Group</Text>
            <Button
                onPress={() => navigation.navigate("NewGroup")}
                backgroundColor={Colors.orangeButton}
                title="Create New Group"
                titleColor="#fff"
                titleSize={16}
                containerStyle={{padding: 16, marginTop: 10, marginBottom: 10}}
            />
            {
                groupCount ?
                    groupList.map((item, index) => (
                        <TouchableHighlight
                            key={item.id}
                            style={styles.item}
                            onPress={() => {
                                navigation.navigate("GroupDetails", {groupId: item.id, groupName: item.name});
                            }}
                        >
                            <Text>{item.name}</Text>
                        </TouchableHighlight>
                    )) : <Text style={styles.p}>You don't have a group now!</Text>
            }
            <View style={{marginTop: 20}}/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    h1: {
        color: '#111',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        margin: 10,
        borderColor: '#2a4944',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#d2f7f1'
    },
    p: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10
    }
})