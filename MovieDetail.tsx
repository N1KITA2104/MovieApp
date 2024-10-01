// MovieDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

interface MovieDetail {
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number;
}

const MovieDetail: React.FC<{ route: any }> = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [overviewHeight, setOverviewHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  useEffect(() => {
    const height = isOverviewExpanded ? getTextHeight(movie?.overview || '') : getTextHeight(movie?.overview?.slice(0, 100) + '...');
    Animated.timing(overviewHeight, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOverviewExpanded, movie]);

  const fetchMovieDetails = async () => {
    const apiKey = '9f3cab36e2cc9fee164ca22d5d706e34';
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    setMovie(response.data);
  };

  const getTextHeight = (text: string) => {
    const lineHeight = 24;
    const numberOfLines = Math.ceil(text.length / 50);
    return numberOfLines * lineHeight;
  };

  if (!movie) {
    return <Text style={styles.loadingText}>Загрузка...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {movie.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.movieImage}
        />
      )}
      <Text style={styles.title}>{movie.title}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.rating}>Рейтинг: {movie.vote_average}/10</Text>
        <Text style={styles.releaseDate}>Дата виходу: {movie.release_date}</Text>
        {movie.runtime && <Text style={styles.runtime}>Тривалість: {movie.runtime} хв</Text>}
        {movie.genres && (
          <Text style={styles.genres}>
            Жанри: {movie.genres.map(genre => genre.name).join(', ')}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.overviewButton} onPress={() => setIsOverviewExpanded(!isOverviewExpanded)}>
        <Text style={styles.overviewTitle}>Опис:</Text>
        <MaterialIcons name={isOverviewExpanded ? 'expand-less' : 'expand-more'} size={24} color="#8B4513" />
      </TouchableOpacity>
      <Animated.View style={[styles.overviewContainer, { height: overviewHeight }]}>
        <Text style={styles.overview}>
          {isOverviewExpanded ? movie.overview : movie.overview?.slice(0, 100) + '...'}
        </Text>
      </Animated.View>
      <View style={styles.separator} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF3E0', // Light warm background
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#8B4513', // Dark brown color for text
  },
  movieImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DEAA8D', // Warm brown border
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#8B4513', // Dark brown for title
  },
  infoContainer: {
    marginBottom: 16,
    backgroundColor: '#FFE4B5', // Light warm background for info container
    padding: 10,
    borderRadius: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#6B4F3A', // Darker shade for readability
  },
  releaseDate: {
    fontSize: 16,
    marginVertical: 2,
    color: '#6B4F3A',
  },
  runtime: {
    fontSize: 16,
    marginVertical: 2,
    color: '#6B4F3A',
  },
  genres: {
    fontSize: 16,
    marginVertical: 2,
    fontStyle: 'italic',
    color: '#6B4F3A',
  },
  overviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFE4B5', // Light warm background for button
    borderRadius: 8,
    marginBottom: 8,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Dark brown for title
  },
  overviewContainer: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333', // Darker text for readability
  },
  separator: {
    height: 16, // Vertical space for separation
  },
});

export default MovieDetail;
