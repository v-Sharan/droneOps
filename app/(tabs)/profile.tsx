import { Text, View } from '@/components/Themed'
import { useUserProfileModal } from '@clerk/expo'
import { TouchableOpacity } from 'react-native'

export default function HomeScreen() {
  const { presentUserProfile } = useUserProfileModal()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={presentUserProfile}>
        <Text>Manage Profile</Text>
      </TouchableOpacity>
    </View>
  )
}