// MovieList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

const MovieList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (query = '') => {
    const apiKey = '9f3cab36e2cc9fee164ca22d5d706e34'; 
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    setMovies(response.data.results);
  };

  const handleSearch = () => {
    fetchMovies(searchQuery);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Пошук фільмів"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Деталі фільму', { movieId: item.id })}>
            <View style={styles.movieItem}>
              {item.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                  style={styles.movieImage}
                />
              )}
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF3E0', // Light warm background
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DEAA8D', // Warm brown border
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#FFFFFF', // White background for input
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFE4B5', // Light warm background for movie item
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600', 
    color: '#8B4513', // Dark brown for text
    flexShrink: 1, 
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default MovieList;
