import { View, Text, ImageBackground, Pressable } from 'react-native'
import React, { useContext, useEffect } from 'react'
import MEDITATION_IMAGES from '@/constants/meditation-images'
import AppGradient from '@/components/AppGradient'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import CustomButton from '@/components/CustomButton'
import { Audio } from 'expo-av'

import { MEDITATION_DATA, AUDIO_FILES } from '@/constants/MedidationData'
import { TimerContext } from '@/context/TimerContext'

const Meditate = () => {

    const { id } = useLocalSearchParams();

    const { duration: secondsRemaining, setDuration } = useContext(TimerContext);

    // const [secondsRemaining, setSecondsRemaining] = React.useState(10);

    const [isMeditating, setIsMeditating] = React.useState(false);

    const [audioSound, setAudioSound] = React.useState<Audio.Sound>();
    const [isPlaying, setIsPlaying] = React.useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout

        // Exit
        if (secondsRemaining === 0) {
            setIsMeditating(false);
            return;
        }

        if (isMeditating) {
            timerId = setTimeout(() => {
                setDuration(secondsRemaining - 1)
            }, 1000)
        }


        return () => {
            clearTimeout(timerId);
        }
    }, [secondsRemaining, isMeditating])


    useEffect(() => {
        return () => {
            setDuration(10);
            audioSound?.unloadAsync();
        }
    }, [audioSound])



    const toggleMeditationSessionStatus = async () => {
        if (secondsRemaining === 0) setDuration(10);

        setIsMeditating(!isMeditating);

        await toggleSound();
    }

    const toggleSound = async () => {
        const sound = audioSound ? audioSound : await initializeSound();

        const status = await sound?.getStatusAsync();
        if (status?.isLoaded && !isPlaying) {
            await sound?.playAsync();
            setIsPlaying(true);
        } else {
            await sound?.pauseAsync();
            setIsPlaying(false);
        }
    }

    const initializeSound = async () => {
        const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;

        const { sound } = await Audio.Sound.createAsync(
            AUDIO_FILES[audioFileName]
        );

        setAudioSound(sound);
        return sound;

    }

    const handleAdjustDuration = () => {
        if (isMeditating) toggleMeditationSessionStatus();

        router.push("/(modal)/adjust-meditation-duration")
    }



    // Format the time left to ensure two digids are displayed
    const formattedTimeMinutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
    const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");

    return (
        <View className='flex-1'>
            <ImageBackground source={MEDITATION_IMAGES[Number(id) - 1]} resizeMode='cover' className='flex-1'>
                <AppGradient colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)"]}>
                    <Pressable onPress={() => router.back()} className='absolute top-16 left-6 z-10'>
                        <AntDesign name="leftcircleo" size={50} color="white" />
                    </Pressable>


                    <View className='flex-1 justify-center'>
                        <View className='mx-auto bg-neutral-200 rounded-full h-44 w-44 justify-center items-center'>
                            <Text className='text-4xl text-blue-800 font-mono'>
                                {formattedTimeMinutes}:{formattedTimeSeconds}
                            </Text>
                        </View>
                    </View>

                    <View className='mb-5'>
                        <CustomButton title="Adjust duration" onPress={handleAdjustDuration} />
                        <CustomButton title={isMeditating ? "Stop" : "Start Meditation"} containerStyles='mt-4' onPress={toggleMeditationSessionStatus} />
                    </View>

                </AppGradient>
            </ImageBackground>
        </View>
    )
}

export default Meditate