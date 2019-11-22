import Constants from 'expo-constants';
import { get } from 'lodash';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView } from 'react-native';
import Button from '../../components/Button';

const { width, height } = Dimensions.get('window');

const categories = [
  {
    "value": "any",
    "text": "Any Category"
  },
  {
    "value": "9",
    "text": "General Knowledge"
  },
  {
    "value": "10",
    "text": "Books"
  },
  {
    "value": "11",
    "text": "Film"
  },
  {
    "value": "12",
    "text": "Music"
  },
  {
    "value": "13",
    "text": "Musicals & Theatres"
  },
  {
    "value": "14",
    "text": "Television"
  },
  {
    "value": "15",
    "text": "Video Games"
  },
  {
    "value": "16",
    "text": "Board Games"
  },
  {
    "value": "17",
    "text": "Science & Nature"
  },
  {
    "value": "18",
    "text": "Computers"
  },
  {
    "value": "19",
    "text": "Mathematics"
  },
  {
    "value": "20",
    "text": "Mythology"
  },
  {
    "value": "21",
    "text": "Sports"
  },
  {
    "value": "22",
    "text": "Geography"
  },
  {
    "value": "23",
    "text": "History"
  },
  {
    "value": "24",
    "text": "Politics"
  },
  {
    "value": "25",
    "text": "Art"
  },
  {
    "value": "26",
    "text": "Celebrities"
  },
  {
    "value": "27",
    "text": "Animals"
  },
  {
    "value": "28",
    "text": "Vehicles"
  },
  {
    "value": "29",
    "text": "Comics"
  },
  {
    "value": "30",
    "text": "Gadgets"
  },
  {
    "value": "31",
    "text": "Japanese Anime & Manga"
  },
  {
    "value": "32",
    "text": "Cartoon & Animations"
  }
]

const styles = {
  safeAreaView: {
    flex: 1,
  },
  firstButton: {
    marginBottom: 10,
  }
}

const SelectCategory = ({ navigation, ...props }) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: Constants.statusBarHeight
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {categories.map((category) => {
          return (
            <Button
              background='purple'
              color='white'
              key={category.value}
              onPress={() => {
                if (get(navigation, 'state.params.mode') === 'MULTI_PLAYER') {
                  return navigation.navigate('NewPlayer', {
                    url: `https://opentdb.com/api.php?amount=10&category=${category.value}`,
                    creator: true
                  })
                }
                navigation.navigate('LoadCategory', {
                  url: `https://opentdb.com/api.php?amount=10&category=${category.value}`
                })
              }}
              textStyle={{ fontSize: 16 }}
              style={styles.firstButton}
            >
              {category.text}
            </Button>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

SelectCategory.navigationOptions = {
  title: 'Select Category'
}

export default SelectCategory;
