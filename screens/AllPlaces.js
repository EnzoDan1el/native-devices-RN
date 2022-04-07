import { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import PlacesList from '../components/Places/PlacesList'
import { fetchPlaces } from '../util/database'

function AllPlaces({ route }) {
  const isFocused = useIsFocused()
  const [loadedPlaces, setLoadedPlaces] = useState([])

  useEffect(() => {
    async function loadPLaces() {
      const places = await fetchPlaces()
      setLoadedPlaces(places)
    }

    if (isFocused) {
      loadPLaces()
    }
  }, [isFocused])

  return <PlacesList places={loadedPlaces} />
}

export default AllPlaces
