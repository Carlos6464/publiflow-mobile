import UserList from '../../../../components/UserList';

export default function TeachersList() {
    return (
        <UserList 
            roleId={2} 
            title="Professores" 
            baseRoute="/(auth)/admin/teachers" 
        />
    );
}