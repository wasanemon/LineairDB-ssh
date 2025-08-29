/*
 *   Copyright (C) 2020 Nippon Telegraph and Telephone Corporation.

 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at

 *   http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

#ifndef LINEAIRDB_SECONDARY_INDEX_H
#define LINEAIRDB_SECONDARY_INDEX_H

#include <lineairdb/config.h>

#include <functional>
#include <memory>
#include <string>
#include <string_view>
#include <vector>

#include "index/precision_locking_index/index.hpp"
#include "secondary_index/secondary_index_interface.h"
#include "types/data_item.hpp"
#include "types/definitions.h"
#include "types/snapshot.hpp"
#include "util/epoch_framework.hpp"

namespace LineairDB {
namespace Index {

template <typename K>
class SecondaryIndex : public SecondaryIndexInterface {
 public:
  using KeyType = K;

  SecondaryIndex(EpochFramework& epoch_framework, Config config = Config(),
                 [[maybe_unused]] bool is_unique = false,
                 [[maybe_unused]] WriteSetType recovery_set = WriteSetType())
      : secondary_index_(
            std::make_unique<HashTableWithPrecisionLockingIndex<DataItem>>(
                config, epoch_framework)),
        epoch_manager_ref_(epoch_framework) {}

  const std::type_info& KeyTypeInfo() const override { return typeid(KeyType); }

 private:
  std::unique_ptr<HashTableWithPrecisionLockingIndex<DataItem>>
      secondary_index_;
  LineairDB::EpochFramework& epoch_manager_ref_;
  std::mutex secondary_index_lock_;
};

}  // namespace Index
}  // namespace LineairDB

#endif /* LINEAIRDB_SECONDARY_INDEX_H */