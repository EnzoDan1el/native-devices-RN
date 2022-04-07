import MapView, { Marker } from 'react-native-maps'
import { StyleSheet, Alert } from 'react-native'
import { useState, useLayoutEffect, useCallback } from 'react'
import IconButton from '../components/UI/IconButton'

function Map({ navigation, route }) {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  }

  const [selectedLocation, setSelectedLocation] = useState(initialLocation) //either undifine or a location

  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const selectLocationHandler = (event) => {
    if (initialLocation) {
      return
    }
    const lat = event.nativeEvent.coordinate.latitude
    const long = event.nativeEvent.coordinate.longitude

    setSelectedLocation({ latitude: lat, longitude: long })
  }
  //  to avoid multiple re-render cycles or infinite loops
  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert('No location picked', 'Tap on the map to select a location')
      return
    }
    navigation.navigate('AddPlace', {
      pickedLat: selectedLocation.latitude,
      pickedLong: selectedLocation.longitude,
    })
  }, [navigation, selectedLocation])

  // to set the option on the map stack navigator from the inside
  useLayoutEffect(() => {
    // if we have an initial location don't show save button
    if (initialLocation) {
      return
    }
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    })
  }),
    [navigation, savePickedLocationHandler, initialLocation]

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker title="Picked Location" coordinate={selectedLocation} />
      )}
    </MapView>
  )
}

export default Map

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
