import React, {useState, useEffect, FormEvent} from 'react';
import logoVector from '../../assets/logo.svg';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    id: string,
    full_name: string;
    description: string;
    owner:{
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {

    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');
        if(storageRepositories){
            return JSON.parse(storageRepositories);
        }else{
            return [];
        }
    });
    const [inputError, setInputError] = useState<string>('');



    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories])

    async function handleAddRepository(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(newRepo === ''){
            setInputError('Digite o nome do autor do repositório');
            return;
        }
        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;
            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch(err) {
            setInputError('Erro na busca desse repositório');
            return;
        }
    }
    return(
        <>
            <img src={logoVector} alt="GitHub Explores"></img>
            <Title>Explore repositórios no GitHub</Title>
            <Form onSubmit={handleAddRepository} hasError={!!inputError}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)} 
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>
            {(inputError !== '') && <Error>{inputError}</Error>}
            <Repositories>
                {repositories.map(repositorie => (
                    <Link to={`/repository?path=${repositorie.full_name}`} key={repositorie.id}>
                        <img src={repositorie.owner.avatar_url} alt={repositorie.owner.login}></img>

                        <div>
                            <strong>{repositorie.full_name}</strong>
                            <p>{repositorie.description}</p>
                        </div>
                        <FiChevronRight size="20"/>
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard;