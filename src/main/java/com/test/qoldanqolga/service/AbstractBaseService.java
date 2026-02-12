package com.test.qoldanqolga.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Абстрактный базовый сервис с общими CRUD-методами.
 * Сервисы с простой логикой могут наследовать и переиспользовать.
 *
 * @param <E>  сущность (Entity)
 * @param <ID> тип идентификатора
 */
public abstract class AbstractBaseService<E, ID> {

    protected abstract JpaRepository<E, ID> getRepository();

    public List<E> findAll() {
        return getRepository().findAll();
    }

    public Optional<E> findById(ID id) {
        return getRepository().findById(id);
    }

    public E save(E entity) {
        return getRepository().save(entity);
    }

    public void delete(E entity) {
        getRepository().delete(entity);
    }

    public void deleteById(ID id) {
        getRepository().deleteById(id);
    }

    public boolean existsById(ID id) {
        return getRepository().existsById(id);
    }
}
