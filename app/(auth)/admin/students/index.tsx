import UserList from '../../../../components/UserList';

export default function StudentsList() {
    return (
        <UserList 
            roleId={1} 
            title="Alunos" 
            baseRoute="/(auth)/admin/students" 
        />
    );
}