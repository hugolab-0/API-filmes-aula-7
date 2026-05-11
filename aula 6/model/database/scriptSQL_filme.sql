# criando o database de filmes 
create database db_filmes_20261_a;

# indicando que vai usar 
use db_filmes_20261_a;

# criando a tabela de filmes 
create table tbl_filme(
# complementos dentro da tabela
	id int not null primary key auto_increment,
    nome varchar(80) not null,
    data_lancamento date not null,
    duracao time not null,
    sinopse text not null,
    avaliacao decimal(3,2) default null,
    valor decimal (5,2) not null default 0,
    capa varchar(255)
);

create table tbl_sexo(
# complementos dentro da tabela
	id int not null primary key auto_increment,
    nome varchar(80) not null,
    sigla varchar(4) not null
);

delete from tbl_filme where id = 1

desc tbl_filme;
# mostrar tabela
show tables;

select * from tbl_filme;

update tbl_filme set 
		nome = 'filme2',
        data_lancamento = '2008-01=01',
        duracao = '02:00',
        sinopse = 'testando o update',
        avaliacao = '2',
        valor = '15',
        capa = 'teste'
			where id = 1;



