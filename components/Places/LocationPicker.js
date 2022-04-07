import { View, StyleSheet, Image, Text } from 'react-native'
import OutlinedButton from '../UI/OutlinedButton'
import { Colors } from '../../constants/colors'
import { useState, useEffect } from 'react'
import { getMapPreview, getAddress } from '../../util/location'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'

import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location'

function LocationPicker({ onTakeLocation }) {
  const [pickedLocation, setPickedLocation] = useState()
  const navigation = useNavigation()
  const route = useRoute()
  const isFocused = useIsFocused() //true if the screen is being rendered, otherwise false

  // to preview a location if it is selected
  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        long: route.params.pickedLong,
      }
      setPickedLocation(mapPickedLocation)
    }
  }, [route, isFocused])

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.long,
        )
        onTakeLocation({ ...location, address: address })
      }
    }
    handleLocation()
  }, [pickedLocation, onTakeLocation])

  const [
    locationPermissionInformation,
    requestPermission,
  ] = useForegroundPermissions()

  const verifyPermissions = async () => {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission()

      return permissionResponse
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions',
        'You need to grant Location permissions',
      )
      return false
    }

    return true
  }

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions()

    if (!hasPermission) {
      return
    }

    const location = await getCurrentPositionAsync()
    setPickedLocation({
      lat: location.coords.latitude,
      long: location.coords.longitude,
    })
  }
  const pickOnMapHandler = () => {
    navigation.navigate('Map')
  }

  let locationPreview = <Text>No location picked yet</Text>

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.long),
        }}
      />
    )
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  )
}

export default LocationPicker

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
})
