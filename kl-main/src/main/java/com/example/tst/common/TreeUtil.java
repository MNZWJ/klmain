package com.example.tst.common;

import com.example.tst.entity.TreeModel;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:49 2017/11/14
 * @Modified By:
 */
public class TreeUtil {

    public static List<TreeModel> getTree(List<TreeModel> treeList){
        List<TreeModel> tree=new ArrayList<>();
        List<TreeModel> rootNodes=new ArrayList<>();
        for (int i=0;treeList.size()>i;i++){
            for (int j=0;j<treeList.size();j++){
                if(treeList.get(i).getParentId().equals(treeList.get(j).getId())){
                    break;
                }
                if(j==treeList.size()-1){
                    rootNodes.add(treeList.get(i));
                }

            }
        }
        for (int i=0;i<rootNodes.size();i++){
            treeList.remove(rootNodes.get(i));
        }
        for(int i=0;i<rootNodes.size();i++){
            loadTree(treeList,rootNodes.get(i));
        }
        return rootNodes;



    }
    private static void loadTree(List<TreeModel> treeList, TreeModel tree){
        tree.setNodes(new ArrayList<>());
        for (int i=0;i<treeList.size();i++){
            if(tree.getId().equals(treeList.get(i).getParentId())){
                tree.getNodes().add(treeList.get(i));
                treeList.remove(i);
                i--;
            }
        }
        for(int i=0;i<tree.getNodes().size();i++){
            loadTree(treeList,tree.getNodes().get(i));
        }

    }

}
