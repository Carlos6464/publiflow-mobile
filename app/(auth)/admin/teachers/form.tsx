import { useLocalSearchParams } from 'expo-router';
import UserForm from '../../../../components/UserForm';

export default function TeacherForm() {
    const { id } = useLocalSearchParams();
    return (
        <UserForm 
            id={id ? String(id) : undefined} 
            roleId={2} 
            roleName="Professor" 
        />
    );
}