import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Header, RepositoryInfo, Issues } from './styles';
import logoVector from '../../assets/logo.svg';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';


interface Repository {
    id: number,
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner:{
        login: string;
        avatar_url: string;
    };
}

interface Issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }
}

const Repository: React.FC = () => {
    const pathRepository = (new URLSearchParams(useLocation().search)).get('path');
    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);


    useEffect(() => {
       api.get(`repos/${pathRepository}`).then(response => {
           setRepository(response.data);
       }) 
    }, [pathRepository]);

    useEffect(() => {
        api.get(`repos/${pathRepository}/issues`).then(response => {
            setIssues(response.data);
        }) 
    }, [pathRepository]);

    return(
        <>
            <Header>
                <img src={logoVector} alt="GitHub Explorer"/>
                <Link to="/">
                    <FiChevronLeft size={16}/>
                    Voltar
                </Link>
            </Header>
            {repository && (<RepositoryInfo>
                <header>
                    <img src={repository?.owner.avatar_url} alt={repository.owner.login}></img>
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                </header>
                <ul>
                    <li>
                        <strong>{repository.stargazers_count}</strong>
                        <span>Stars</span>
                    </li>
                    <li>
                        <strong>{repository.forks_count}</strong>
                        <span>Forks</span>
                    </li>
                    <li>
                        <strong>{repository.open_issues_count}</strong>
                        <span>Issues abertas</span>
                    </li>
                </ul>
            </RepositoryInfo>)}

            {issues.map(issue => {
                return(
                    <Issues>
                        <a key={issue.id} href={issue.html_url} target="blank">
                            <div>
                                <strong>{issue.title}</strong>
                                <p>{issue.user.login}</p>
                            </div>
                            <FiChevronRight size="20"/>
                        </a>
                    </Issues>
                )
            })}
        </>
    );
}

export default Repository;