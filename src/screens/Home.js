import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, StatusBar, FlatList } from "react-native";
import {Audio} from "expo-av";
import MusicItem from "../components/MusicItem";

export default function Home({navigation}) {
  const [currentPLaying, setCurrentPLaying] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [musicData, setMusicData] = useState([]);

  const togglePlayPause = async (item) => {
    if(currentSound && currentPLaying == item.id) {
      await currentSound.pauseAsync();
      setCurrentPLaying(null);
      setCurrentSound(null);
    }else {
      if(currentSound) {
        await currentSound.unloadAsync();
      }
      const {sound} = await Audio.Sound.createAsync(
        {uri: `http://10.0.2.2:3000/musics/${item.music_path}`},
        {shouldPlay: true }
      );
      setCurrentSound(sound);
      setCurrentPLaying(item.id);
    }
  }

  useEffect(()=> {fetch("http://10.0.2.2:3000/musics").then((response) => response.json()).then((data)=> setMusicData(data))},[])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212"/>
      <Text style={styles.title}>Minhas Músicas</Text>
      <FlatList data={musicData} keyExtractor={(item)=> item.id.toString()} renderItem={({item}) =>(
      <MusicItem  
      music={item} 
      onPlayPause={()=>togglePlayPause(item)}
      isPlaying={currentPLaying === item.id} 
      navigation={navigation} />)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#121212",
    paddingTop: 16,
  },
  title:{
    fontSize:36,
    fontWeight:"bold",
    color:"#fff",
    marginBottom:20,
    marginLeft:20,  
  },
})