// app/books/[id]/edit/EditBookForm.tsx

import { 
    Book, Genre, Publisher, Author 
} from "@/types";
import { 
    TextField, Button, Box, Grid, Select, MenuItem, 
    InputLabel, FormControl, Alert, Checkbox, FormControlLabel, 
    FormGroup, Collapse, IconButton, Typography, Stack
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditBookFormProps {
    initialData: Book;
    allGenres: Genre[];
    allPublishers: Publisher[];
    allAuthors: Author[];
}

// Компонент-обгортка для Grid
const GridItem: React.FC<any> = (props) => (
    <Grid item {...props} />
);

export default function EditBookForm({ 
    initialData, allGenres, allPublishers, allAuthors 
}: EditBookFormProps) {
    
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData.title,
        description: initialData.description,
        year: initialData.year,
        price: initialData.price,
        publisher_id: initialData.publisher?.id || allPublishers[0]?.id || '',
        author_id: initialData.author?.id || allAuthors[0]?.id || '',
        genres: initialData.genres.map(g => g.id), 
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [genresExpanded, setGenresExpanded] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as number }));
    };

    const handleGenreChange = (genreId: number) => {
        setFormData(prev => {
            const genres = prev.genres.includes(genreId)
                ? prev.genres.filter(id => id !== genreId) 
                : [...prev.genres, genreId]; 
            return { ...prev, genres };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.put(`/books/${initialData.id}`, formData);

            setSuccess(true);
            setTimeout(() => {
                router.push(`/books/${initialData.id}`);
            }, 1500);

        } catch (err: any) {
            let errorMessage = "Помилка збереження. Перевірте всі поля.";
            if (err.response?.data?.errors) {
                errorMessage = Object.values(err.response.data.errors).flat().join(' ');
            } else if (err.response?.data?.message) {
                 errorMessage = err.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm('Ви впевнені, що хочете видалити цю книгу? Цю дію неможливо скасувати.')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.delete(`/books/${initialData.id}`);

            // Після успішного видалення перенаправляємо на головну сторінку
            router.push('/');

        } catch (err: any) {
            let errorMessage = "Помилка видалення книги.";
            if (err.response?.data?.message) {
                 errorMessage = err.response.data.message;
            }
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ mt: 3, maxWidth: 800, mx: 'auto' }}
        >
            {success && <Alert severity="success" sx={{ mb: 2 }}>Книгу успішно оновлено!</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={3}>
                
                {/* 1. Назва та Рік */}
                <GridItem xs={12} sm={9}>
                    <TextField
                        label="Назва книги"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </GridItem>
                <GridItem xs={12} sm={3}>
                    <TextField
                        label="Рік"
                        name="year"
                        type="number"
                        value={formData.year}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </GridItem>
                
                {/* ... (Видавництво, Автор, Ціна) ... */}
                <GridItem xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Видавництво</InputLabel>
                        <Select
                            label="Видавництво"
                            name="publisher_id"
                            value={formData.publisher_id}
                            onChange={handleSelectChange}
                        >
                            {allPublishers.map((pub) => (
                                <MenuItem key={pub.id} value={pub.id}>
                                    {pub.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </GridItem>
                <GridItem xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Автор</InputLabel>
                        <Select
                            label="Автор"
                            name="author_id"
                            value={formData.author_id}
                            onChange={handleSelectChange}
                        >
                            {allAuthors.map((author) => (
                                <MenuItem key={author.id} value={author.id}>
                                    {author.user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </GridItem>
                 <GridItem xs={12} sm={6}>
                    <TextField
                        label="Ціна (грн)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </GridItem>

                {/* ... (Жанри, Опис) ... */}
                <GridItem xs={12}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Жанри</Typography>
                            <IconButton onClick={() => setGenresExpanded(!genresExpanded)}>
                                {genresExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                        
                        <Collapse in={genresExpanded}>
                            <FormGroup row sx={{ mt: 1 }}>
                                {allGenres.map((genre) => (
                                    <FormControlLabel
                                        key={genre.id}
                                        control={
                                            <Checkbox
                                                checked={formData.genres.includes(genre.id)}
                                                onChange={() => handleGenreChange(genre.id)}
                                            />
                                        }
                                        label={genre.name}
                                        sx={{ width: 'auto', mr: 2 }} 
                                    />
                                ))}
                            </FormGroup>
                        </Collapse>
                    </Box>
                </GridItem>
                <GridItem xs={12}>
                    <TextField
                        label="Опис книги"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={6}
                        fullWidth
                    />
                </GridItem>
                
                {/* Кнопки Зберегти та Видалити */}
                <GridItem xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end"> 
                        
                        {/* Кнопка Видалити */}
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Видалити
                        </Button>
                        
                        {/* Кнопка Зберегти */}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            disabled={loading}
                            sx={{ minWidth: 150 }} // Трохи фіксованої ширини
                        >
                            {loading ? 'Збереження...' : 'Зберегти зміни'}
                        </Button>
                    </Stack>
                </GridItem>
            </Grid>
        </Box>
    );
}