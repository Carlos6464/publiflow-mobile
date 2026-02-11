import { useLocalSearchParams } from 'expo-router';
import UserForm from '../../../../components/UserForm';

export default function StudentForm() {
    const { id } = useLocalSearchParams();
    return (
        <UserForm 
            id={id ? String(id) : undefined} 
            roleId={1} 
            roleName="Aluno" 
        />
    );
}